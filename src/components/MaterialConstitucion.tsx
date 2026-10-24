import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import ConceptStudy from './ConceptStudy';
import { loadConceptProgress, resolveTopicId, type ConceptProgress } from '../lib/conceptEngine';
import { renderMarkdown } from '../utils/miniMarkdown';
import { descargarMaterial } from '../utils/descargaLegible';

/**
 * Piloto Constitución · Título Preliminar (tema 1). Tres capas de material de menos a más
 * (esquema → desarrollo → texto completo con conceptos), descarga gratuita del texto oficial y
 * estudio por conceptos con la escalera de niveles. Los recuentos vienen del servidor (reales).
 */
const BASE = '/material/constitucion/';
export const CAPAS = [
  { id: 'esquema', label: 'Esquema', file: 'titulo-preliminar-1-esquema.md', nota: '1–2 folios: lo esencial de un vistazo.' },
  { id: 'desarrollo', label: 'Desarrollo', file: 'titulo-preliminar-2-desarrollo.md', nota: 'Cada idea con sus matices y las trampas del examen.' },
  { id: 'completo', label: 'Texto BOE', file: 'titulo-preliminar-3-completo.md', nota: 'Texto literal del BOE. Debajo de cada artículo, ponte a prueba con sus conceptos.' },
] as const;
export const TEXTO_OFICIAL = 'constitucion-espanola-texto-oficial.md';
const TEMA_CONSTITUCION = 1;

interface Props {
  userId: string;
  onExit: () => void;
}

export default function MaterialConstitucion({ userId, onExit }: Props) {
  const [capa, setCapa] = useState<(typeof CAPAS)[number]['id']>('esquema');
  const [texto, setTexto] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [topicId, setTopicId] = useState<number | null | undefined>(undefined);
  const [progress, setProgress] = useState<ConceptProgress | null>(null);
  const [estudiando, setEstudiando] = useState(false);
  const [todas, setTodas] = useState(false);
  const actual = CAPAS.find(c => c.id === capa)!;

  useEffect(() => {
    let active = true;
    setTexto(null); setError(false); setTodas(false);
    fetch(BASE + actual.file)
      .then(r => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then(t => { if (active) setTexto(t); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [actual.file]);

  useEffect(() => {
    let active = true;
    void resolveTopicId(TEMA_CONSTITUCION).then(async id => {
      if (!active) return;
      setTopicId(id);
      if (id != null) {
        try { const p = await loadConceptProgress(id, userId); if (active) setProgress(p); } catch { /* sin recuento */ }
      }
    });
    return () => { active = false; };
  }, [userId, estudiando]);

  if (estudiando && topicId != null) {
    return (
      <ConceptStudy userId={userId} topicId={topicId} onExit={() => setEstudiando(false)}
        etiqueta="Constitución · Título Preliminar" titulo="Estudia los conceptos de los arts. 1 a 9" />
    );
  }

  const disponibles = progress?.total ?? 0;
  // Descarga legible (HTML con formato y tildes correctas). Si algo falla, sigue el enlace normal.
  const descargar = (e: React.MouseEvent, url: string, titulo: string) => {
    e.preventDefault();
    descargarMaterial(url, titulo).catch(() => { window.location.href = url; });
  };
  return (
    <div className="mx-auto max-w-3xl">
      <button type="button" onClick={onExit} className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver al inicio
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Tema 1 · Constitución Española · Piloto</p>
        <h1 className="mt-1 text-xl font-bold text-slate-900">Título Preliminar (arts. 1–9)</h1>
        <p className="mt-2 text-sm text-slate-600">
          Lee de menos a más y después estudia: cada concepto tiene su tarjeta y preguntas en tres niveles. Si fallas, te lo vuelve a preguntar más fácil; si aciertas, sube.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={() => setEstudiando(true)} disabled={topicId == null || disponibles === 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 disabled:opacity-50">
            {topicId === undefined ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Cargando…</> : 'Estudiar estos conceptos'}
          </button>
          <a href={BASE + TEXTO_OFICIAL} download onClick={e => descargar(e, BASE + TEXTO_OFICIAL, 'Constitución Española · Texto oficial (BOE)')}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4" aria-hidden="true" /> Constitución completa (texto oficial BOE)
          </a>
        </div>
        <p className="mt-2 text-xs text-slate-500" data-testid="recuento">
          {topicId === undefined ? ' '
            : disponibles > 0 ? `${disponibles} conceptos disponibles para estudiar en este tema.`
            : 'Los conceptos de este tema aún no están publicados.'}
        </p>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto" role="tablist" aria-label="Capas del material">
        {CAPAS.map(c => (
          <button key={c.id} type="button" role="tab" aria-selected={capa === c.id} onClick={() => setCapa(c.id)}
            className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold ${capa === c.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>
            {c.label}
          </button>
        ))}
      </div>

      <article className="mt-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" role="tabpanel" aria-label={actual.label}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs text-slate-500">{actual.nota}</p>
          <a href={BASE + actual.file} download onClick={e => descargar(e, BASE + actual.file, `Título Preliminar · ${actual.label}`)} className="flex shrink-0 items-center gap-1 text-xs font-semibold text-indigo-700 underline">
            <Download className="h-3.5 w-3.5" aria-hidden="true" /> Descargar
          </a>
        </div>
        {error && <p role="alert" className="mt-4 text-sm font-semibold text-red-700">No se ha podido cargar el material. Comprueba la conexión.</p>}
        {!error && texto === null && <p role="status" className="mt-4 text-sm text-slate-500">Cargando…</p>}
        {texto !== null && capa === 'completo' && (
          <button type="button" onClick={() => setTodas(v => !v)} className="mt-3 min-h-11 rounded-lg bg-slate-100 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-200">
            {todas ? 'Ocultar respuestas' : 'Ver todas las respuestas'}
          </button>
        )}
        {texto !== null && <div className="mt-2">{renderMarkdown(texto, { autoevaluacion: capa === 'completo', mostrarRespuestas: todas })}</div>}
      </article>
    </div>
  );
}
