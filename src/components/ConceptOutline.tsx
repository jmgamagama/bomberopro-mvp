/**
 * Mapa de conceptos de un tema: documento → apartado → conceptos, con recuentos reales de la base de
 * datos (migración 23: get_concept_outline / get_concept_outline_tema). Lo pidió JM el 23/10/2026:
 * el alumno debe ver cuántos conceptos tiene cada bloque y apartado, cuáles son y cuántas preguntas
 * de test hay de cada uno. Nunca se escriben recuentos a mano.
 */
import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DOCUMENTOS_OFICIALES } from '../data/fuentesOficiales';
import Skeleton from './Skeleton';

export interface OutlineConcept { id: string; pregunta: string; respuesta: string | null; preguntas: number; dominado: boolean }
export interface OutlineApartado { apartado: string; total: number; dominados: number; preguntas: number; conceptos: OutlineConcept[] }
export interface OutlineDocumento { documento: string; total: number; dominados: number; preguntas: number; apartados: OutlineApartado[] }
export interface OutlineTema { tema: number; nombre: string; total: number; dominados: number; preguntas: number; documentos?: OutlineDocumento[] }

/** Nombre legible de cada documento (el código es el que guarda la base de datos). */
export const DOCUMENTOS: Record<string, string> = Object.fromEntries(
  Object.entries(DOCUMENTOS_OFICIALES).map(([codigo, d]) => [codigo, d.nombre]),
);

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/**
 * Resumen por tema (ligero). `resumen` es el mapa nº de tema → recuentos; la base de datos solo
 * devuelve los temas que tienen conceptos publicados. `listo` es true solo cuando la respuesta
 * llegó bien: mientras carga (o si falla) no se puede afirmar que un tema no tenga conceptos.
 */
export function useConceptSummary(): { resumen: Record<number, OutlineTema>; listo: boolean } {
  const [estado, setEstado] = useState<{ resumen: Record<number, OutlineTema>; listo: boolean }>({ resumen: {}, listo: false });
  useEffect(() => {
    let vivo = true;
    if (!supabase) return;
    Promise.resolve(supabase.rpc('get_concept_outline'))
      .then(({ data, error }) => {
        if (!vivo || error || !Array.isArray(data)) return;
        setEstado({ resumen: Object.fromEntries((data as OutlineTema[]).map((t) => [t.tema, t])), listo: true });
      })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);
  return estado;
}

/** Con `listo` y sin recuento, el tema no tiene conceptos: solo se practica con tests. */
export function ConceptCountBadge({ tema, listo = false }: { tema?: OutlineTema; listo?: boolean }) {
  if (!tema) {
    return listo ? <span className="text-xs font-semibold text-orange-700">Solo tests</span> : null;
  }
  return (
    <span className="text-xs font-semibold text-indigo-700">
      {plural(tema.total, 'concepto', 'conceptos')} · {plural(tema.preguntas, 'pregunta', 'preguntas')}
      {tema.dominados > 0 && <span className="text-emerald-700"> · {tema.dominados} dominados</span>}
    </span>
  );
}

export default function ConceptOutline({ tema }: { tema: number }) {
  const [state, setState] = useState<{ status: 'loading' | 'error' | 'ready'; data?: OutlineTema }>({ status: 'loading' });
  const [abiertos, setAbiertos] = useState<Record<string, boolean>>({});
  const [vistos, setVistos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let vivo = true;
    if (!supabase) { setState({ status: 'error' }); return; }
    Promise.resolve(supabase.rpc('get_concept_outline_tema', { p_tema: tema }))
      .then(({ data, error }) => {
        if (!vivo) return;
        if (error || !Array.isArray(data)) setState({ status: 'error' });
        else setState({ status: 'ready', data: (data as OutlineTema[])[0] });
      })
      .catch(() => { if (vivo) setState({ status: 'error' }); });
    return () => { vivo = false; };
  }, [tema]);

  if (state.status === 'loading') return <Skeleton label="Cargando conceptos…" block={false} lines={2} className="p-3" />;
  if (state.status === 'error') return <p className="text-sm text-slate-600 p-3">No se han podido cargar los conceptos. Inténtalo de nuevo más tarde.</p>;
  const t = state.data;
  if (!t) return <p className="text-sm text-slate-600 p-3">Este tema todavía no tiene conceptos publicados.</p>;

  return (
    <section aria-label={`Conceptos del tema ${t.tema}`} className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
      <p className="text-sm text-slate-700">
        <strong>{plural(t.total, 'concepto', 'conceptos')}</strong> y {plural(t.preguntas, 'pregunta de test', 'preguntas de test')} en este tema.
        {t.dominados > 0 && <> Llevas <strong className="text-emerald-700">{t.dominados} de {t.total}</strong> dominados.</>}
      </p>
      {t.documentos?.map((d) => (
        <div key={d.documento} className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900">
            {DOCUMENTOS[d.documento] ?? d.documento}
            <span className="font-normal text-slate-600"> — {plural(d.total, 'concepto', 'conceptos')}</span>
          </h3>
          <ul className="space-y-1">
            {d.apartados.map((a) => {
              const clave = `${d.documento}|${a.apartado}`;
              const abierto = !!abiertos[clave];
              return (
                <li key={clave} className="bg-white rounded-lg border border-slate-200">
                  <button
                    type="button"
                    aria-expanded={abierto}
                    onClick={() => setAbiertos((p) => ({ ...p, [clave]: !p[clave] }))}
                    className="w-full min-h-11 flex items-center justify-between gap-2 px-3 py-2 text-left"
                  >
                    <span className="flex items-center gap-1.5 text-sm text-slate-800">
                      {abierto ? <ChevronDown className="w-4 h-4 shrink-0" aria-hidden="true" /> : <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />}
                      {a.apartado || 'General'}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-slate-600">
                      {a.dominados > 0 ? `${a.dominados} de ${a.total} dominados` : plural(a.total, 'concepto', 'conceptos')} · {plural(a.preguntas, 'pregunta', 'preguntas')}
                    </span>
                  </button>
                  {abierto && (
                    <ol className="px-3 pb-3 space-y-2 list-decimal list-inside">
                      {a.conceptos.map((c) => (
                        <li key={c.id} className="text-sm text-slate-800">
                          <span>{c.pregunta}</span>
                          <span className="text-xs text-slate-500"> · {plural(c.preguntas, 'pregunta', 'preguntas')}</span>
                          {c.dominado && <CheckCircle2 className="inline w-4 h-4 ml-1 text-emerald-600" aria-label="Dominado" />}
                          {c.respuesta ? (
                            vistos[c.id] ? (
                              <p className="mt-1 ml-5 p-2 rounded bg-indigo-50 text-slate-800">{c.respuesta}</p>
                            ) : (
                              <button type="button" onClick={() => setVistos((p) => ({ ...p, [c.id]: true }))} className="ml-2 text-xs font-semibold text-indigo-700 underline">
                                Ver respuesta
                              </button>
                            )
                          ) : null}
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {!t.documentos?.length && null}
      {t.documentos && t.documentos.every((d) => d.apartados.every((a) => a.conceptos.every((c) => c.respuesta === null))) && (
        <p className="text-xs text-slate-600">Crea tu cuenta gratis para ver las respuestas y guardar lo que dominas.</p>
      )}
    </section>
  );
}
