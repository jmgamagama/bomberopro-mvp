import { Fragment, useState, type ReactNode } from 'react';

export interface MarkdownOptions {
  /** Las líneas «- **¿Pregunta?** Respuesta» se pintan con la respuesta oculta (autoevaluación). */
  autoevaluacion?: boolean;
  /** Fuerza a mostrar todas las respuestas (botón «Ver todas»). */
  mostrarRespuestas?: boolean;
}

/** Concepto «**¿Pregunta?** Respuesta»: devuelve [pregunta, respuesta] o null. */
export function partirConcepto(item: string): [string, string] | null {
  const m = /^\*\*([^*]*\?)\*\*\s+(.+)$/.exec(item.trim());
  return m && m[1].includes('¿') ? [m[1], m[2]] : null;
}

/** Tarjeta de autoevaluación: primero piensa la respuesta, luego compruébala. */
function Autoevaluacion({ pregunta, respuesta, abierta }: { pregunta: string; respuesta: string; abierta: boolean }) {
  const [vista, setVista] = useState(false);
  const ver = abierta || vista;
  return (
    <li className="list-none rounded-lg border border-slate-200 bg-white p-3" data-autoevaluacion>
      <p className="font-semibold text-slate-900">{pregunta}</p>
      {ver
        ? <p className="mt-1 rounded bg-emerald-50 px-2 py-1 text-slate-800">{inline(respuesta, 'r')}</p>
        : <button type="button" onClick={() => setVista(true)} className="mt-2 min-h-11 rounded-lg border border-indigo-200 px-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">Piénsalo y ver respuesta</button>}
    </li>
  );
}

/**
 * Renderizador mínimo de Markdown para el material propio (public/material/*.md).
 * Admite: #, ##, ###; listas «-» y «1.»; citas «>»; tablas «|»; **negrita**, _cursiva_ y párrafos.
 * No interpreta HTML: el texto se pinta siempre como texto (React escapa), así que no hay inyección.
 */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\[[^\]]+\]\(https?:\/\/[^)\s]+\)|\*\*[^*]+\*\*|_[^_]+_)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const link = /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/.exec(t);
    if (link) out.push(<a key={`${keyBase}-a${i++}`} href={link[2]} target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-700 underline hover:text-orange-700">{link[1]}</a>);
    else if (t.startsWith('**')) out.push(<strong key={`${keyBase}-b${i++}`}>{t.slice(2, -2)}</strong>);
    else out.push(<em key={`${keyBase}-i${i++}`}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const cells = (row: string) => row.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());

export function renderMarkdown(md: string, opts: MarkdownOptions = {}): ReactNode[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;
  const key = () => `md${k++}`;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      const lvl = h[1].length;
      const cls = lvl === 1 ? 'mt-2 text-xl font-bold text-slate-900' : lvl === 2 ? 'mt-6 text-lg font-bold text-slate-900' : 'mt-4 text-base font-bold text-slate-800';
      const content = inline(h[2], `h${k}`);
      blocks.push(lvl === 1 ? <h2 key={key()} className={cls}>{content}</h2> : lvl === 2 ? <h3 key={key()} className={cls}>{content}</h3> : <h4 key={key()} className={cls}>{content}</h4>);
      i++; continue;
    }
    if (line.startsWith('|')) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      const [head, , ...body] = rows;
      blocks.push(
        <div key={key()} className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead><tr>{cells(head).map((c, j) => <th key={j} className="border-b border-slate-300 px-2 py-1.5 font-semibold text-slate-800">{inline(c, `th${j}`)}</th>)}</tr></thead>
            <tbody>{body.map((r, ri) => <tr key={ri}>{cells(r).map((c, j) => <td key={j} className="border-b border-slate-100 px-2 py-1.5 align-top text-slate-700">{inline(c, `td${ri}-${j}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^>/.test(lines[i])) quote.push(lines[i++].replace(/^>\s?/, ''));
      const paras = quote.join('\n').split(/\n\s*\n|\n(?=\S)/).map(p => p.trim()).filter(Boolean);
      blocks.push(
        <blockquote key={key()} className="mt-3 border-l-4 border-indigo-200 bg-indigo-50/50 px-4 py-2 text-sm text-slate-800">
          {paras.map((p, j) => <p key={j} className={j ? 'mt-2' : ''}>{inline(p, `q${k}-${j}`)}</p>)}
        </blockquote>,
      );
      continue;
    }
    if (/^\s*(-|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*(-|\d+\.)\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*(-|\d+\.)\s+/, ''));
      const lis = items.map((t, j) => {
        const c = opts.autoevaluacion ? partirConcepto(t) : null;
        if (c) return <Fragment key={j}><Autoevaluacion pregunta={c[0]} respuesta={c[1]} abierta={!!opts.mostrarRespuestas} /></Fragment>;
        // «Trampa: …» se destaca: es el error típico de las preguntas de examen.
        if (/^(Trampa|No confundir|Ojo)/.test(t)) return <li key={j} className="list-none -ml-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900" data-trampa>⚠️ {inline(t, `li${k}-${j}`)}</li>;
        return <li key={j}>{inline(t, `li${k}-${j}`)}</li>;
      });
      blocks.push(ordered
        ? <ol key={key()} className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">{lis}</ol>
        : <ul key={key()} className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">{lis}</ul>);
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|\||>|\s*(-|\d+\.)\s)/.test(lines[i])) para.push(lines[i++]);
    blocks.push(<p key={key()} className="mt-2 text-sm leading-relaxed text-slate-700">{inline(para.join(' '), `p${k}`)}</p>);
  }
  return blocks;
}
