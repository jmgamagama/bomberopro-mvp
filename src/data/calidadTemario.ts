/**
 * Validadores de calidad del temario (QA). Funciones puras, sin red ni dependencias nuevas.
 *
 * 1. Fichas de recuerdo: el campo «fuente» se muestra al alumno como «Fuente:» (DailySession), así que
 *    debe ser una cita breve, no un párrafo pegado, y debe permitir localizar la norma.
 * 2. Material por tema (esquema y desarrollo): formato del Tema 1, el patrón de docs/ESTANDAR_MATERIAL_TEMAS.md.
 * 3. Transcripción del anexo I del repo frente a los epígrafes del BOP n.º 135/2026.
 *
 * Hoy hay cientos de fallos heredados, así que el test (`calidadTemario.test.ts`) funciona como trinquete:
 * compara con `calidadTemario.baseline.json` y solo falla si aparece un fallo que no estaba.
 */
import type { RecallSourceCard } from './recallRegistry';

// ── 1. Fichas ────────────────────────────────────────────────────────────────

/** Longitud máxima de una cita de fuente legible en la tarjeta. */
export const FUENTE_MAX = 300;
/** Longitud máxima de la localización (artículo, apartado, página…). */
export const LOCALIZACION_MAX = 200;

export type FalloFicha =
  | 'fuente_larga'
  | 'fuente_parrafo'
  | 'fuente_sin_referencia'
  | 'fuente_sin_url'
  | 'localizacion_larga';

export const FALLOS_FICHA: readonly FalloFicha[] = [
  'fuente_larga',
  'fuente_parrafo',
  'fuente_sin_referencia',
  'fuente_sin_url',
  'localizacion_larga',
];

const URL_RE = /https?:\/\/\S+/;

/**
 * Referencia normativa o documental reconocible: identificador oficial (BOE, DOE, BOP, ELI), tipo de norma con
 * número, norma técnica (UNE, NTP, ITC, ADR) o documento interno citado por su sigla (ITF, PT del CPEI).
 */
const REFERENCIA_RE = new RegExp(
  [
    String.raw`\bBOE-A-\d{4}-\d+`,
    String.raw`\bDOE\b`,
    String.raw`\bBOP\b`,
    String.raw`\bELI\b`,
    String.raw`\b(?:Real Decreto|Real Decreto Legislativo|RD|RDL|Decreto(?: Legislativo)?|Ley(?: Orgánica)?|LO|Orden|Resolución|Reglamento|Directiva|Instrucción)\b[^.]{0,60}?\d+\/\d{2,4}`,
    String.raw`\b(?:UNE|EN|ISO|NTP|ITC|ADR|RID|CTE|DB[- ]?SI|DB[- ]?SUA|RSCIEI|RIPCI|ITF|PT)\b`,
    String.raw`\b(?:Constitución|Estatuto de Autonomía|Código Técnico|Plan (?:Territorial|Especial|Estatal)|PLATERCAEX|PLASISMEX|INFOEX|INE|IGN|CNIG|SITEX|OACI|UIT|INSST|DGT)\b`,
  ].join('|'),
  'i',
);

/** Un párrafo pegado: saltos de línea o tres o más frases seguidas. */
function pareceParrafo(s: string): boolean {
  if (/\n/.test(s)) return true;
  const frases = s.replace(URL_RE, ' ').match(/[a-záéíóúñ)»”]{2,}[.:;]\s+[A-ZÁÉÍÓÚÑ¿«“]/g) ?? [];
  return frases.length >= 3;
}

/** Fallos de formato de la cita de una ficha. */
export function fallosFicha(c: Pick<RecallSourceCard, 'fuente' | 'localizacion'>): FalloFicha[] {
  const fuente = (c.fuente ?? '').trim();
  const loc = (c.localizacion ?? '').trim();
  const out: FalloFicha[] = [];
  if (fuente.length > FUENTE_MAX) out.push('fuente_larga');
  if (pareceParrafo(fuente)) out.push('fuente_parrafo');
  if (!URL_RE.test(fuente) && !REFERENCIA_RE.test(`${fuente} ${loc}`)) out.push('fuente_sin_referencia');
  if (!URL_RE.test(`${fuente} ${loc}`)) out.push('fuente_sin_url');
  if (loc.length > LOCALIZACION_MAX || /\n/.test(loc)) out.push('localizacion_larga');
  return out;
}

// ── 2. Material ──────────────────────────────────────────────────────────────

export type FalloMaterial =
  | 'h1_sin_capa'
  | 'sin_secciones'
  | 'negritas_bajas'
  | 'negritas_desemparejadas'
  | 'esquema_solo_enlaces';

export const FALLOS_MATERIAL: readonly FalloMaterial[] = [
  'h1_sin_capa',
  'sin_secciones',
  'negritas_bajas',
  'negritas_desemparejadas',
  'esquema_solo_enlaces',
];

/** Negritas mínimas por cada 1.000 caracteres (el Tema 1 tiene unas 17-24; se exige una fracción). */
export const NEGRITAS_MIN_POR_MIL = 5;

export interface MetricasMaterial {
  caracteres: number;
  negritas: number;
  negritasPorMil: number;
  secciones: number;
  /** Líneas de contenido: sin título, cabecera de fuente, rótulos solo en negrita ni líneas que son solo un enlace. */
  lineasConContenido: number;
  enlacesSolos: number;
}

const CABECERA_FUENTE = /^(Texto consolidado|Texto extraído|Fuente oficial|Texto con carácter informativo|\d+ preceptos?\b|Cada rúbrica)/i;
const ROTULO = /^\*\*[^*]+\*\*$/;
const SOLO_ENLACE = /^\s*(?:[-*]\s+|\d+\.\s+)?\[[^\]]+\]\([^)]+\)\s*\.?\s*$/;

export function metricasMaterial(md: string): MetricasMaterial {
  const caracteres = md.length;
  const negritas = (md.match(/\*\*[^*\n]+?\*\*/g) ?? []).length;
  const lineas = md.split('\n');
  let lineasConContenido = 0;
  let enlacesSolos = 0;
  for (const l of lineas) {
    const t = l.trim();
    if (!t || t.startsWith('# ') || CABECERA_FUENTE.test(t) || ROTULO.test(t)) continue;
    if (SOLO_ENLACE.test(t)) enlacesSolos++;
    else lineasConContenido++;
  }
  return {
    caracteres,
    negritas,
    negritasPorMil: caracteres ? (negritas * 1000) / caracteres : 0,
    secciones: (md.match(/^#{2,3} /gm) ?? []).length,
    lineasConContenido,
    enlacesSolos,
  };
}

/** Fallos de formato de un esquema o desarrollo frente al patrón del Tema 1. */
export function fallosMaterial(md: string, capa: 'esquema' | 'desarrollo'): FalloMaterial[] {
  const m = metricasMaterial(md);
  const out: FalloMaterial[] = [];
  const h1 = md.split('\n').find((l) => l.startsWith('# ')) ?? '';
  const sufijo = capa === 'esquema' ? '· Esquema' : '· Desarrollo';
  if (!h1.trim().endsWith(sufijo)) out.push('h1_sin_capa');
  if (m.secciones === 0) out.push('sin_secciones');
  if (m.negritasPorMil < NEGRITAS_MIN_POR_MIL) out.push('negritas_bajas');
  if (md.split('\n').some((l) => (l.match(/\*\*/g) ?? []).length % 2 === 1)) out.push('negritas_desemparejadas');
  // Un índice de rúbricas enlazadas no es un esquema (docs/ESTANDAR_MATERIAL_TEMAS.md, «un único enlace… no constituye»).
  if (capa === 'esquema' && m.lineasConContenido === 0 && m.enlacesSolos > 0) out.push('esquema_solo_enlaces');
  return out;
}

// ── 3. Anexo I ───────────────────────────────────────────────────────────────

/** Palabras normalizadas (sin tildes, puntuación ni la nota «— …» que el repo añade al final). */
export function palabrasEpigrafe(s: string): string[] {
  const sinNota = s.replace(/\s+—\s.*$/, '');
  return sinNota
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

/** Diferencia compacta («-palabra» falta en el repo, «+palabra» sobra) con una LCS por palabras. */
export function diferenciaEpigrafe(oficial: string, repo: string): string {
  const a = palabrasEpigrafe(oficial);
  const b = palabrasEpigrafe(repo);
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: string[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) out.push(`-${a[i++]}`);
    else out.push(`+${b[j++]}`);
  }
  while (i < a.length) out.push(`-${a[i++]}`);
  while (j < b.length) out.push(`+${b[j++]}`);
  return out.join(' ');
}

/** Epígrafes de la transcripción del repo (`**Tema N.** texto`). */
export function epigrafesRepo(md: string): Record<number, string> {
  const out: Record<number, string> = {};
  for (const m of md.matchAll(/^\*\*Tema (\d+)\.\*\* (.+)$/gm)) out[Number(m[1])] = m[2].trim();
  return out;
}
