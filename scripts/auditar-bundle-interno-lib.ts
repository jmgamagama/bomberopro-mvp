/**
 * Auditoría del bundle con VITE_INTERNAL_DECKS_FROM_SERVER=true (issue #333).
 *
 * El material interno del CPEI (T38 ITF, parte SOS del T39, T40 PT01/PT03, la muestra de invitado y
 * «Ordena los pasos») no puede viajar en `dist/`. Para comprobarlo SIN guardar su texto en el repo, se
 * guardan solo huellas: sha256 (truncado a 16 hex) de ventanas de VENTANA palabras normalizadas de cada
 * cadena literal de los módulos internos. Las ventanas que también aparecen en código público (otros
 * módulos de src/) se descartan para no dar falsos positivos (títulos del anexo I, nombres de normas…).
 *
 * La comprobación calcula TODAS las ventanas de cada fichero de dist/ y busca sus huellas en la lista.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export const VENTANA = 7;
/** Una de cada PASO ventanas de cada literal: basta para detectar cualquier frase de ≥ VENTANA+PASO−1 palabras. */
export const PASO = 3;
export const HEX = 16;

/** Módulos de src/data con material interno (con la bandera no deben entrar en el bundle). */
export const MODULOS_INTERNOS = [
  'tema38Recall.ts',
  'tema39SosRecall.ts',
  'tema40Recall.ts',
  'initialDataInterno.ts',
  'procedimientoPasos.ts',
] as const;

/** Prefijos de id de ficha interna (T38 entero, SOS del T39, T40 entero). */
export const PREFIJO_ID_INTERNO = /CPEI-T(?:38|39-S[A-Z]{2}|40)(?:-[A-Z0-9]+)+/g;

/** Deshace escapes JS/JSON habituales (\uXXXX, \xXX, \n…) para comparar fuente y bundle por igual. */
export function decodificarEscapes(s: string): string {
  return s
    .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\[nrt]/g, ' ');
}

/** Minúsculas, sin tildes, solo letras y cifras separadas por un espacio. */
export function normalizar(s: string): string[] {
  return decodificarEscapes(s)
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

export function huella(ventana: readonly string[]): string {
  return createHash('sha256').update(ventana.join(' ')).digest('hex').slice(0, HEX);
}

export function huellasDe(palabras: readonly string[], paso = 1): string[] {
  const out: string[] = [];
  for (let i = 0; i + VENTANA <= palabras.length; i += paso) out.push(huella(palabras.slice(i, i + VENTANA)));
  // la última ventana siempre, para que el muestreo cubra el final del literal
  if (paso > 1 && palabras.length >= VENTANA && (palabras.length - VENTANA) % paso !== 0) {
    out.push(huella(palabras.slice(palabras.length - VENTANA)));
  }
  return out;
}

/** Cadenas literales ("…", '…', `…`) de un fichero fuente. */
export function literales(fuente: string): string[] {
  const re = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  return [...fuente.matchAll(re)].map((m) => m[1] ?? m[2] ?? m[3] ?? '');
}

export interface Centinelas {
  version: 1;
  ventana: number;
  hex: number;
  /** Huellas ordenadas; nunca el texto. */
  huellas: string[];
}

/** Genera las huellas de los módulos internos menos las que también salen en código público. */
export function generarCentinelas(internos: readonly string[], publicos: readonly string[]): Centinelas {
  const publicas = new Set<string>();
  for (const src of publicos) for (const lit of literales(src)) for (const h of huellasDe(normalizar(lit))) publicas.add(h);
  const set = new Set<string>();
  for (const src of internos) {
    for (const lit of literales(src)) {
      for (const h of huellasDe(normalizar(lit), PASO)) if (!publicas.has(h)) set.add(h);
    }
  }
  return { version: 1, ventana: VENTANA, hex: HEX, huellas: [...set].sort() };
}

export interface Fuga {
  fichero: string;
  coincidencias: number;
}

/** Ficheros de dist/ con alguna ventana cuya huella está en la lista de centinelas. */
export function buscarFugas(ficheros: readonly { path: string; content: string }[], c: Centinelas): Fuga[] {
  if (c.ventana !== VENTANA || c.hex !== HEX) throw new Error('Centinelas generados con otros parámetros: regenera.');
  const set = new Set(c.huellas);
  const fugas: Fuga[] = [];
  for (const f of ficheros) {
    let n = 0;
    for (const h of huellasDe(normalizar(f.content))) if (set.has(h)) n += 1;
    if (n) fugas.push({ fichero: f.path, coincidencias: n });
  }
  return fugas;
}

/** Ids de fichas internas presentes en un texto. */
export function idsInternos(texto: string): Set<string> {
  return new Set(texto.match(PREFIJO_ID_INTERNO) ?? []);
}

export async function walk(dir: string, filtro: (f: string) => boolean): Promise<string[]> {
  const out: string[] = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p, filtro));
    else if (e.isFile() && filtro(p)) out.push(p);
  }
  return out;
}

export async function fuentes(root: string): Promise<{ internos: string[]; publicos: string[] }> {
  const internosPath = MODULOS_INTERNOS.map((m) => path.join(root, 'src', 'data', m)).filter((p) => existsSync(p));
  const todos = await walk(path.join(root, 'src'), (p) => /\.(ts|tsx)$/.test(p) && !/\.test\.tsx?$/.test(p));
  // tema39Recall.ts reexporta público + SOS; no aporta literales propios de fichas.
  const publicosPath = todos.filter((p) => !internosPath.includes(p) && path.basename(p) !== 'tema39Recall.ts');
  return {
    internos: await Promise.all(internosPath.map((p) => readFile(p, 'utf8'))),
    publicos: await Promise.all(publicosPath.map((p) => readFile(p, 'utf8'))),
  };
}

