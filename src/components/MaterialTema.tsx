import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  /** Texto del botón de volver (por defecto, «Volver al inicio»). */
  volverLabel?: string;
  /** Desde una ficha o un fallo (src/utils/materialEnContexto.ts): bloque y precepto a desplegar y resaltar. */
  foco?: { bloque?: string; precepto?: string; etiqueta?: string };
  /** Texto con el que se abrió desde el estudio («ficha» / «fallo»), para el aviso de arriba. */
  origen?: string;
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

export default function MaterialTema({ userId, onExit, tema: temaInicial = 1, volverLabel = 'Volver al inicio', foco, origen }: Props) {
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
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {volverLabel}
      </button>

      {origen && tema === temaInicial && (
        <p className="mb-4 rounded-xl border border-[#1E3A5F] bg-white p-3 text-sm text-slate-800" data-testid="foco-material">
          {foco?.bloque
            ? <>Desde {origen}: {foco.etiqueta ?? 'su precepto'}, resaltado en su bloque.</>
            : <>Desde {origen}: se abre el tema entero, porque su fuente no cita un artículo de este material que se pueda comprobar.</>}
        </p>
      )}
      <label className="mb-4 block text-sm font-semibold text-slate-700">
        Tema
        <select value={tema} onChange={(e) => { setTema(Number(e.target.value)); setEstudiando(false); }}
          className="mt-1 block min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base text-slate-900 sm:text-sm">
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
                {f.version && !f.doe && <span className="text-xs text-slate-500"> · texto consolidado a {f.version}</span>}
                {f.doe && (
                  <div className="mt-1 text-xs text-slate-600" data-testid="aviso-doe">
                    <p>
                      {f.doe.version} · {f.doe.publicacion}:{' '}
                      <a href={f.doe.pdfDoe} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1E3A5F] underline hover:text-[#C2410C]">PDF del DOE</a>
                    </p>
                    <p className="mt-0.5">
                      <strong className="text-[#C2410C]">El DOE no tiene API de vigencia: comprobado a mano el {f.doe.comprobado}.</strong>{' '}
                      Qué se buscó: {f.doe.busqueda}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          {topicId !== undefined && (topicId == null || disponibles === 0) ? (
            // Sin conceptos publicados no hay nada que abrir: un aviso honesto en vez de un botón apagado.
            <p className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-700" data-testid="conceptos-en-preparacion">
              Conceptos en preparación
            </p>
          ) : (
            <button type="button" onClick={() => setEstudiando(true)} disabled={topicId === undefined}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 disabled:opacity-50">
              {topicId === undefined ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Cargando…</> : 'Estudiar los conceptos'}
            </button>
          )}
          {material?.textoOficial && <DescargaOficial material={material} />}
        </div>
        <p className="mt-2 text-xs text-slate-500" data-testid="recuento">
          {topicId === undefined ? ' '
            : disponibles > 0 ? `${disponibles} conceptos disponibles para estudiar en este tema.`
            : 'Los conceptos de este tema aún no están publicados.'}
        </p>
      </div>

      {material
        ? <div key={material.tema}><Capas material={material} foco={tema === temaInicial ? foco : undefined} /></div>
        : (
          <p className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-slate-800" role="status">
            Este tema aún no tiene esquema, desarrollo ni texto oficial en la app.
            {fuentes.length > 0 ? ' Puedes leer la norma en el BOE con el enlace de arriba.' : ''}
            {' '}Temas con material: {MATERIAL_TEMAS.map((m) => m.tema).sort((a, b) => a - b).join(', ')}.
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

/** Elemento del texto que corresponde al precepto: el enlace a su ancla del BOE o su encabezado/línea «Art. N». */
export function buscarPrecepto(raiz: HTMLElement, precepto: string): HTMLElement | null {
  // Apartado de un plan del DOE («s-iv-3-1»): sus enlaces van a una página del PDF, compartida; se busca por el número
  // con que empieza el encabezado o la línea («IV.3.1 PUESTO…», o «3.1.- …» si el capítulo no va en el número).
  const s = /^s-(.+)$/.exec(precepto);
  if (s) {
    const partes = s[1].split('-');
    const nums = [partes.map((x) => x.toUpperCase()).join('.')];
    if (/^[ivxl]+$/.test(partes[0]) && partes.length > 1) nums.push(partes.slice(1).join('.'));
    const res = nums.map((n) => new RegExp(`^${n.replace(/\./g, '\\.')}(?:\\.?-|\\.)?(?:\\s|$)`, 'i'));
    for (const el of raiz.querySelectorAll<HTMLElement>('h2, h3, h4, li')) {
      const t = (el.textContent ?? '').trim();
      if (res.some((re) => re.test(t))) return el;
    }
    return null;
  }
  const enlace = raiz.querySelector<HTMLElement>(`a[href$="#${precepto.replace(/[^a-z0-9-]/gi, "")}"]`);
  if (enlace) return enlace.closest<HTMLElement>('li, h2, h3, h4, p') ?? enlace;
  const m = /^a(\d+)(bis|ter|quater)?$/.exec(precepto);
  if (!m) return null;
  const n = `${m[1]}${m[2] ? ` ${m[2]}` : ''}`;
  const re = new RegExp(`^Art(?:ículo|s?\\.)\\s*[\\d\\s,y]*?\\b${n}\\b(?![.]\\d)`, 'i');
  for (const el of raiz.querySelectorAll<HTMLElement>('h2, h3, h4, li')) {
    const t = (el.textContent ?? '').trim();
    if (re.test(t) || (el.tagName === 'LI' && new RegExp(`^${n}\\s`).test(t))) return el;
  }
  return null;
}

function Capas({ material, foco }: { material: Material; foco?: Props['foco'] }) {
  const inicial = material.bloques.find((b) => b.id === foco?.bloque) ?? material.bloques[0];
  const [bloqueId, setBloqueId] = useState(inicial.id);
  const bloque = material.bloques.find((b) => b.id === bloqueId) ?? material.bloques[0];
  const primera = (CAPAS.find((c) => bloque.capas[c.id])?.id ?? 'esquema') as CapaId;
  const [capa, setCapa] = useState<CapaId>(primera);
  const file = bloque.capas[capa];
  const actual = CAPAS.find((c) => c.id === capa)!;
  const [texto, setTexto] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [todas, setTodas] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  // Resaltado del precepto (solo en el bloque al que apunta el foco). Si el esquema no lo nombra, se pasa al texto oficial.
  const [resalte, setResalte] = useState<'buscando' | 'ok' | 'no' | null>(foco?.precepto ? 'buscando' : null);
  useEffect(() => {
    if (!foco?.precepto || bloque.id !== foco.bloque || texto === null || !panel.current || resalte === 'ok' || resalte === 'no') return;
    const el = buscarPrecepto(panel.current, foco.precepto);
    if (el) {
      el.setAttribute('data-resaltado', '');
      el.classList.add('rounded', 'bg-orange-50', 'outline', 'outline-2', 'outline-[#C2410C]', 'outline-offset-2');
      el.tabIndex = -1;
      el.scrollIntoView?.({ block: 'center' });
      el.focus?.({ preventScroll: true });
      setResalte('ok');
    } else if (capa !== 'completo' && bloque.capas.completo) {
      setCapa('completo');
    } else {
      setResalte('no');
    }
  }, [texto, capa, bloque, foco, resalte]);

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
            className="mt-1 block min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base text-slate-900 sm:text-sm">
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
              <p className="text-xs text-slate-500">{capa === 'completo' && material.fuentes.some((f) => f.doe) ? 'Texto literal del PDF oficial (plan o decreto del DOE), apartado por apartado.' : actual.nota}</p>
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
            {foco?.precepto && bloque.id === foco.bloque && resalte === 'no' && (
              <p className="mt-2 text-xs text-slate-700">Este bloque contiene {foco.etiqueta ?? 'el precepto'}, pero el texto no lo nombra para resaltarlo.</p>
            )}
            {texto !== null && <div className="mt-2" ref={panel}>{renderMarkdown(texto, { autoevaluacion: capa === 'completo', mostrarRespuestas: todas })}</div>}
          </>
        )}
      </article>
    </>
  );
}
