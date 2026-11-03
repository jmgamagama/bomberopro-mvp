/**
 * Cobertura pregunta → ficha del simulacro de muestra (01/11/2026): cuántas preguntas tienen fichas
 * relacionadas (relacionFichas.ts) y, las que no, por qué. Genera docs/FICHAS_FALTAN_SIMULACRO.md
 * (`npm run cobertura:simulacro`). No inventa fichas: solo lista norma y cita.
 */
import type { RecallCard } from '../data/recallCards';
import type { Question } from '../types';
import { relacionar, type CausaSinFicha, type Relacion } from './relacionFichas';

export interface FilaCobertura { id: string; tema: number | null; fuente: string; rel: Relacion }

export function coberturaSimulacro(questions: readonly Question[], pool: readonly RecallCard[], temaVisible: (id: string) => boolean) {
  const filas: FilaCobertura[] = questions.map((q) => ({ id: q.id, tema: q.tema?.numero ?? null, fuente: q.fuente ?? '', rel: relacionar(q, pool, temaVisible) }));
  const con = filas.filter((f) => f.rel.fichas.length > 0).length;
  return { filas, con, total: filas.length, pct: filas.length ? Math.round((con / filas.length) * 1000) / 10 : 0 };
}

const CAUSA: Record<CausaSinFicha, string> = {
  sin_tema: 'la pregunta no tiene tema',
  tema_oculto: 'el tema está oculto al alumno',
  cita_ilegible: 'la cita no dice artículo ni localización legible',
  cita_amplia: 'la cita es demasiado amplia (casa con más de 12 fichas)',
  sin_ficha: 'el artículo o la localización no tiene ficha',
};

const norma = (fuente: string) => fuente.split(/ — |,\s*art(?:[íi]culo|\.)\s/i)[0].trim();
const cita = (fuente: string) => { const i = fuente.lastIndexOf(' — '); return i < 0 ? fuente.slice(norma(fuente).length).replace(/^,\s*/, '') : fuente.slice(i + 3); };

export function informeMarkdown(c: ReturnType<typeof coberturaSimulacro>, antes: { con: number; total: number }): string {
  const sin = c.filas.filter((f) => f.rel.fichas.length === 0);
  const faltan = sin.filter((f) => f.rel.causa === 'sin_ficha');
  const otras = sin.filter((f) => f.rel.causa !== 'sin_ficha');
  const pct = (n: number, t: number) => `${t ? Math.round((n / t) * 1000) / 10 : 0} %`.replace('.', ',');
  const out = [
    '# Fichas que faltan para el simulacro de muestra',
    '',
    'Generado por `npm run cobertura:simulacro` (src/utils/coberturaSimulacro.ts). No se inventan fichas: solo se listan la norma y la cita.',
    '',
    `- Preguntas del simulacro de muestra: ${c.total}.`,
    `- Con alguna ficha relacionada: **${c.con} de ${c.total} (${pct(c.con, c.total)})**. Antes de feat/fallo-ficha-cobertura: ${antes.con} de ${antes.total} (${pct(antes.con, antes.total)}).`,
    `- Relacionadas por artículo: ${c.filas.filter((f) => f.rel.criterio === 'articulo').length}; por la misma localización (página, hoja, anexo/columna): ${c.filas.filter((f) => f.rel.criterio === 'localizacion').length}; por la misma localización y el mismo código de carretera: ${c.filas.filter((f) => f.rel.criterio === 'codigo').length}.`,
    '',
    '## Artículos o localizaciones sin ficha',
    '',
  ];
  if (faltan.length === 0) out.push('Ninguno: todas las citas legibles y concretas tienen al menos una ficha.');
  else {
    out.push('| Pregunta | Tema | Norma | Artículo o localización |', '|---|---|---|---|');
    for (const f of faltan) out.push(`| ${f.id} | T${f.tema} | ${norma(f.fuente)} | ${cita(f.fuente)} |`);
  }
  out.push('', '## Preguntas sin ficha por otra causa', '');
  if (otras.length === 0) out.push('Ninguna.');
  else {
    out.push('| Pregunta | Tema | Norma | Cita | Causa |', '|---|---|---|---|---|');
    for (const f of otras) out.push(`| ${f.id} | ${f.tema != null ? `T${f.tema}` : '—'} | ${norma(f.fuente)} | ${cita(f.fuente)} | ${CAUSA[f.rel.causa!]} |`);
  }
  out.push('');
  return out.join('\n');
}

/** Cobertura medida con el criterio anterior (solo artículo y tema) en 25afc6b, para el informe. */
export const COBERTURA_ANTES = { con: 6, total: 15 } as const;
