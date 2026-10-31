import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Download, ExternalLink, Loader2, CheckCircle2, MinusCircle } from 'lucide-react';
import ConceptStudy from './ConceptStudy';
import Skeleton from './Skeleton';
import { useConceptSummary } from './ConceptOutline';
import { loadConceptProgress, resolveTopicId, type ConceptProgress } from '../lib/conceptEngine';
import { renderMarkdown } from '../utils/miniMarkdown';
import { descargarMaterial } from '../utils/descargaLegible';
import { supabase } from '../lib/supabase';
import { getVisibleTopics } from '../data/recallRegistry';
import {
  CAPAS, FUENTES_SIN_MATERIAL, MATERIAL_TEMAS, capasDisponibles, materialDeTema, materialUrl,
  type CapaId, type MaterialTema as Material,
} from '../data/materialTemas';

/**
 * Material de estudio de un tema, a partir de src/data/materialTemas.ts: esquema → desarrollo → texto
 * oficial, fuentes enlazadas y estudio por conceptos. Generaliza el piloto de la Constitución (T1).
 * Si un tema no tiene material, dice qué tiene (conceptos, fichas, fuente) y qué no, sin pantallas vacías.
 */
interface Props {
  userId: string;
  onExit: () => void;
  tema?: number;
}

const TEMAS = Array.from({ length: 40 }, (_, i) => i + 1);

function useNombresTemas(): Record<number, string> {
  const [nombres, setNombres] = useState<Record<number, string>>({});
  useEffect(() => {
    let vivo = true;
    if (!supabase) return;
    Promise.resolve(supabase.from('topics').select('numero,nombre').eq('convocatoria_id', 1).order('numero'))
      .then(({ data }) => {
        if (vivo && Array.isArray(data)) setNombres(Object.fromEntries(data.map((t: { numero: number; nombre: string }) => [t.numero, t.nombre])));
      })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);
  return nombres;
}

function Estado({ si, children }: { si: boolean; children: React.ReactNode }) {
  return (
    <li className={`flex items-start gap-2 text-sm ${si ? 'text-slate-800' : 'text-slate-500'}`}>
      {si
        ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" aria-label="Sí" />
        : <MinusCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" aria-label="No" />}
      <span>{children}</span>
    </li>
  );
}

export default function MaterialTema({ userId, onExit, tema: temaInicial = 1 }: Props) {
  const [tema, setTema] = useState(temaInicial);
  const nombres = useNombresTemas();
  const { resumen, listo } = useConceptSummary();
  const material = materialDeTema(tema);
  const conceptos = resumen[tema];
  const fichas = useMemo(() => getVisibleTopics().filter((t) => t.tema === tema).reduce((n, t) => n + t.count, 0), [tema]);
  const fuentes = material?.fuentes ?? FUENTES_SIN_MATERIAL[tema] ?? [];
  const nombre = nombres[tema] ?? material?.nombre ?? '';

  const [topicId, setTopicId] = useState<number | null | undefined>(undefined);
  const [progress, setProgress] = useState<ConceptProgress | null>(null);
  const [estudiando, setEstudiando] = useState(false);

  useEffect(() => {
    let active = true;
    setTopicId(undefined); setProgress(null);
    void resolveTopicId(tema).then(async (id) => {
      if (!active) return;
      setTopicId(id);
      if (id != null) {
        try { const p = await loadConceptProgress(id, userId); if (active) setProgress(p); } catch { /* sin recuento */ }
      }
    });
    return () => { active = false; };
  }, [tema, userId, estudiando]);

  if (estudiando && topicId != null) {
    return (
      <ConceptStudy userId={userId} topicId={topicId} onExit={() => setEstudiando(false)}
        etiqueta={`Tema ${tema}${nombre ? ` · ${nombre}` : ''}`} titulo="Estudia los conceptos del tema" />
    );
  }

  const disponibles = progress?.total ?? 0;
  const capas = material ? capasDisponibles(material) : [];

  return (
    <div className="mx-auto max-w-3xl">
      <button type="button" onClick={onExit} className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver al inicio
      </button>

      <label className="mb-4 block text-sm font-semibold text-slate-700">
        Tema
        <select value={tema} onChange={(e) => { setTema(Number(e.target.value)); setEstudiando(false); }}
          className="mt-1 block min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900">
          {TEMAS.map((n) => (
            <option key={n} value={n}>
              {`Tema ${n}${nombres[n] ? `. ${nombres[n]}` : ''}${materialDeTema(n) ? ' · con material' : ''}`}
            </option>
          ))}
        </select>
      </label>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Tema {tema}{material?.piloto ? ' · Piloto' : ''}
        </p>
        <h1 className="mt-1 text-xl font-bold text-slate-900">{nombre || `Tema ${tema}`}</h1>
        {material?.alcance && <p className="mt-2 text-sm text-slate-600">{material.alcance}</p>}

        <h2 className="mt-4 text-sm font-bold text-slate-900">Qué tiene este tema en la app</h2>
        <ul className="mt-2 space-y-1.5" data-testid="estado-tema">
          <Estado si={capas.includes('esquema')}>Esquema{capas.includes('esquema') ? '' : ': todavía no'}</Estado>
          <Estado si={capas.includes('desarrollo')}>Desarrollo{capas.includes('desarrollo') ? '' : ': todavía no (lo redacta y revisa una persona)'}</Estado>
          <Estado si={capas.includes('completo') || !!material?.textoOficial}>
            Texto oficial{capas.includes('completo') || material?.textoOficial ? '' : ': todavía no en la app'}
          </Estado>
          <Estado si={fuentes.length > 0}>
            {fuentes.length > 0 ? 'Fuente oficial enlazada' : 'Fuente oficial: sin enlace verificado todavía'}
          </Estado>
          <Estado si={!!conceptos}>
            {conceptos
              ? `${conceptos.total} conceptos · ${conceptos.preguntas} preguntas ligadas`
              : listo ? 'Conceptos: ninguno publicado (se practica con tests)' : 'Conceptos: comprobando…'}
          </Estado>
          <Estado si={fichas > 0}>{fichas > 0 ? `${fichas} fichas de recuerdo` : 'Fichas de recuerdo: ninguna publicada'}</Estado>
        </ul>

        {fuentes.length > 0 && (
          <ul className="mt-3 space-y-1">
            {fuentes.map((f) => (
              <li key={f.url} className="text-sm">
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-indigo-700 underline hover:text-orange-700">
                  {f.titulo}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                {f.version && <span className="text-xs text-slate-500"> · texto consolidado a {f.version}</span>}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={() => setEstudiando(true)} disabled={topicId == null || disponibles === 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 disabled:opacity-50">
            {topicId === undefined ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Cargando…</> : 'Estudiar los conceptos'}
          </button>
          {material?.textoOficial && <DescargaOficial material={material} />}
        </div>
        <p className="mt-2 text-xs text-slate-500" data-testid="recuento">
          {topicId === undefined ? ' '
            : disponibles > 0 ? `${disponibles} conceptos disponibles para estudiar en este tema.`
            : 'Los conceptos de este tema aún no están publicados.'}
        </p>
      </div>

      {material
        ? <div key={material.tema}><Capas material={material} /></div>
        : (
          <p className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-slate-800" role="status">
            Este tema aún no tiene esquema, desarrollo ni texto oficial en la app.
            {fuentes.length > 0 ? ' Puedes leer la norma en el BOE con el enlace de arriba.' : ''}
            {' '}Temas con material: {MATERIAL_TEMAS.map((m) => m.tema).join(', ')}.
          </p>
        )}
    </div>
  );
}

function descargar(e: React.MouseEvent, url: string, titulo: string) {
  e.preventDefault();
  descargarMaterial(url, titulo).catch(() => { window.location.href = url; });
}

function DescargaOficial({ material }: { material: Material }) {
  const t = material.textoOficial!;
  const url = materialUrl(material, t.file);
  return (
    <a href={url} download onClick={(e) => descargar(e, url, t.titulo)}
      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
      <Download className="h-4 w-4" aria-hidden="true" /> Norma completa (texto oficial)
    </a>
  );
}

function Capas({ material }: { material: Material }) {
  const [bloqueId, setBloqueId] = useState(material.bloques[0].id);
  const bloque = material.bloques.find((b) => b.id === bloqueId) ?? material.bloques[0];
  const primera = (CAPAS.find((c) => bloque.capas[c.id])?.id ?? 'esquema') as CapaId;
  const [capa, setCapa] = useState<CapaId>(primera);
  const file = bloque.capas[capa];
  const actual = CAPAS.find((c) => c.id === capa)!;
  const [texto, setTexto] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [todas, setTodas] = useState(false);

  useEffect(() => {
    let active = true;
    setTexto(null); setError(false); setTodas(false);
    if (!file) return;
    fetch(materialUrl(material, file))
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((t) => { if (active) setTexto(t); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [material, file]);

  return (
    <>
      {material.bloques.length > 1 && (
        <label className="mt-6 block text-sm font-semibold text-slate-700">
          Bloque
          <select value={bloque.id} onChange={(e) => {
            const b = material.bloques.find((x) => x.id === e.target.value)!;
            setBloqueId(b.id);
            if (!b.capas[capa]) setCapa((CAPAS.find((c) => b.capas[c.id])?.id ?? 'esquema') as CapaId);
          }}
            className="mt-1 block min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900">
            {material.bloques.map((b) => <option key={b.id} value={b.id}>{b.titulo}</option>)}
          </select>
        </label>
      )}

      <div className="mt-4 flex gap-2 overflow-x-auto" role="tablist" aria-label="Capas del material">
        {CAPAS.map((c) => {
          const hay = !!bloque.capas[c.id];
          return (
            <button key={c.id} type="button" role="tab" aria-selected={capa === c.id} onClick={() => setCapa(c.id)}
              className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold ${capa === c.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'} ${hay ? '' : 'border-dashed'}`}>
              {c.label}{hay ? '' : ' · no disponible'}
            </button>
          );
        })}
      </div>

      <article className="mt-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" role="tabpanel" aria-label={actual.label}>
        {!file ? (
          <p className="text-sm text-slate-700" data-testid="capa-ausente">
            Este bloque no tiene <strong>{actual.label.toLowerCase()}</strong> todavía. No se rellena con texto inventado:
            {' '}{capa === 'desarrollo' ? 'el desarrollo lo redacta y revisa una persona a partir del texto oficial.' : 'se añadirá cuando se genere desde la fuente oficial.'}
            {' '}Tiene: {CAPAS.filter((c) => bloque.capas[c.id]).map((c) => c.label).join(', ') || 'nada aún'}.
          </p>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs text-slate-500">{actual.nota}</p>
              <a href={materialUrl(material, file)} download onClick={(e) => descargar(e, materialUrl(material, file), `${bloque.titulo} · ${actual.label}`)}
                className="flex shrink-0 items-center gap-1 text-xs font-semibold text-indigo-700 underline">
                <Download className="h-3.5 w-3.5" aria-hidden="true" /> Descargar
              </a>
            </div>
            {error && <p role="alert" className="mt-4 text-sm font-semibold text-red-700">No se ha podido cargar el material. Comprueba la conexión.</p>}
            {!error && texto === null && <Skeleton label="Cargando el texto…" block={false} lines={5} className="mt-4" />}
            {texto !== null && capa === 'completo' && texto.includes('**¿') && (
              <button type="button" onClick={() => setTodas((v) => !v)} className="mt-3 min-h-11 rounded-lg bg-slate-100 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                {todas ? 'Ocultar respuestas' : 'Ver todas las respuestas'}
              </button>
            )}
            {texto !== null && <div className="mt-2">{renderMarkdown(texto, { autoevaluacion: capa === 'completo', mostrarRespuestas: todas })}</div>}
          </>
        )}
      </article>
    </>
  );
}
