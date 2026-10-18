import { useEffect, useState } from 'react';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import ConceptStudy from './ConceptStudy';
import { loadConceptProgress, resolveTopicId, type ConceptProgress } from '../lib/conceptEngine';
import { renderMarkdown } from '../utils/miniMarkdown';

/**
 * Piloto Constitución · Título Preliminar (tema 1). Tres capas de material de menos a más
 * (esquema → desarrollo → texto completo con conceptos), descarga gratuita del texto oficial y
 * estudio por conceptos con la escalera de niveles. Los recuentos vienen del servidor (reales).
 */
const BASE = '/material/constitucion/';
export const CAPAS = [
  { id: 'esquema', label: '1 · Esquema', file: 'titulo-preliminar-1-esquema.md', nota: '1–2 folios: lo esencial de un vistazo.' },
  { id: 'desarrollo', label: '2 · Desarrollo', file: 'titulo-preliminar-2-desarrollo.md', nota: 'Cada idea con sus matices y las trampas del examen.' },
  { id: 'completo', label: '3 · Texto completo', file: 'titulo-preliminar-3-completo.md', nota: 'Texto literal del BOE y los conceptos de cada artículo.' },
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
  const actual = CAPAS.find(c => c.id === capa)!;

  useEffect(() => {
    let active = true;
    setTexto(null); setError(false);
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
          <a href={BASE + TEXTO_OFICIAL} download
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
          <a href={BASE + actual.file} download className="flex shrink-0 items-center gap-1 text-xs font-semibold text-indigo-700 underline">
            <Download className="h-3.5 w-3.5" aria-hidden="true" /> Descargar
          </a>
        </div>
        {error && <p role="alert" className="mt-4 text-sm font-semibold text-red-700">No se ha podido cargar el material. Comprueba la conexión.</p>}
        {!error && texto === null && <p role="status" className="mt-4 text-sm text-slate-500">Cargando…</p>}
        {texto !== null && <div className="mt-2">{renderMarkdown(texto)}</div>}
      </article>
    </div>
  );
}
