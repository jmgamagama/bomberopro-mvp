import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ClipboardList, ExternalLink, RotateCcw, XCircle } from 'lucide-react';
import { getVisibleSupuestos, loadSupuestos } from '../data/supuestos/supuestosRegistry';
import type { PreguntaSupuesto, Supuesto } from '../data/supuestos/supuestosTypes';
import {
  corregirSupuesto,
  guardarResultado,
  leerUltimosResultados,
  type RespuestaSupuesto,
  type ResultadoSupuesto,
} from '../data/supuestos/supuestosCorreccion';

interface SupuestosPracticosProps {
  onNavigateHome: () => void;
}

const LETRAS = ['A', 'B', 'C', 'D'] as const;

function enlaceOficial(fuente: string): string | null {
  return fuente.match(/https?:\/\/\S+/)?.[0] ?? null;
}

function formatNumero(n: number): string {
  return n.toLocaleString('es-ES', { maximumFractionDigits: 3 });
}

export default function SupuestosPracticos({ onNavigateHome }: SupuestosPracticosProps) {
  const visibles = useMemo(() => getVisibleSupuestos(), []);
  const [contenido, setContenido] = useState<readonly Supuesto[] | null>(null);
  const [error, setError] = useState(false);
  const [activoId, setActivoId] = useState<string | null>(null);
  const [respuestas, setRespuestas] = useState<Record<string, RespuestaSupuesto>>({});
  const [resultado, setResultado] = useState<ResultadoSupuesto | null>(null);
  const [ultimos, setUltimos] = useState(() => leerUltimosResultados());

  useEffect(() => {
    let vivo = true;
    loadSupuestos()
      .then((lista) => vivo && setContenido(lista))
      .catch(() => vivo && setError(true));
    return () => {
      vivo = false;
    };
  }, []);

  const activo = contenido?.find((s) => s.id === activoId && visibles.some((v) => v.id === s.id)) ?? null;

  const abrir = (id: string) => {
    setActivoId(id);
    setRespuestas({});
    setResultado(null);
    window.scrollTo?.({ top: 0 });
  };

  const corregir = () => {
    if (!activo) return;
    const r = corregirSupuesto(activo, respuestas);
    setResultado(r);
    guardarResultado(activo.id, r);
    setUltimos(leerUltimosResultados());
    window.scrollTo?.({ top: 0 });
  };

  const volverALista = () => {
    setActivoId(null);
    setResultado(null);
    setRespuestas({});
  };

  if (!activo) {
    return (
      <div className="mx-auto mt-4 max-w-3xl space-y-5 sm:mt-8" id="supuestos-root">
        <section className="space-y-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <ClipboardList className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-black text-slate-800">Supuestos prácticos</h2>
              <p className="mt-1 text-sm text-slate-500">
                Casos originales con preguntas tipo test y de cálculo. Cada respuesta cita su fuente oficial.
              </p>
            </div>
          </div>

          {visibles.length === 0 ? (
            <p className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900" role="status">
              Todavía no hay supuestos publicados.
            </p>
          ) : (
            <ul className="space-y-3" aria-label="Lista de supuestos">
              {visibles.map((s) => {
                const ultimo = ultimos[s.id];
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => abrir(s.id)}
                      disabled={!contenido}
                      data-supuesto-id={s.id}
                      className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-orange-200 hover:bg-orange-50 disabled:opacity-60"
                    >
                      <span className="block text-sm font-semibold text-slate-800">{s.titulo}</span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {s.temas.map((t) => `T${t}`).join(' · ')} · {s.numPreguntas} preguntas
                        {ultimo ? ` · último: ${ultimo.aciertos}/${ultimo.total}` : ''}
                      </span>
                      {s.revision === 'pendiente' && (
                        <span className="mt-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                          Pendiente de revisión
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {error && (
            <p className="text-sm text-red-700" role="alert">
              No se han podido cargar los supuestos. Revisa la conexión y vuelve a entrar.
            </p>
          )}

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
            En el examen (bases, BOP de Badajoz n.º 135, 17/07/2026) el segundo ejercicio dura 120 minutos y consiste en
            uno o varios supuestos práctico-teóricos de la parte específica que elige el tribunal; se valora el
            razonamiento y la ortografía. Aquí solo se practica la parte que se puede corregir sola.
          </div>

          <button type="button" onClick={onNavigateHome} className="min-h-11 px-2 text-xs font-semibold text-slate-500 hover:text-slate-700">
            Volver al inicio
          </button>
        </section>
      </div>
    );
  }

  const respondidas = activo.preguntas.filter((p) => {
    const r = respuestas[p.id];
    return r !== undefined && r !== '';
  }).length;

  return (
    <div className="mx-auto mt-4 max-w-3xl space-y-5 sm:mt-8" id="supuestos-root">
      <section className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
          Supuesto práctico · {activo.temas.map((t) => `Tema ${t}`).join(' · ')}
        </p>
        <h2 className="text-lg font-bold text-slate-800">{activo.titulo}</h2>
        <p className="text-sm leading-relaxed text-slate-700">{activo.enunciado}</p>
        <p className="text-[11px] text-slate-500">Caso original. Fuentes: {activo.fuentes.join('; ')}.</p>
      </section>

      {resultado && (
        <section
          className="space-y-2 rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm"
          role="status"
          aria-live="polite"
          id="supuesto-resultado"
        >
          <p className="text-3xl font-black text-slate-800">
            {resultado.aciertos}/{resultado.total}
          </p>
          <p className="text-sm text-slate-600">
            aciertos ({Math.round(resultado.proporcion * 100)} %). Repasa abajo la explicación y la fuente de cada pregunta.
          </p>
          <p className="text-[11px] text-slate-500">
            No es la nota oficial: el tribunal califica de 0 a 10 la respuesta razonada.
          </p>
        </section>
      )}

      <ol className="space-y-4">
        {activo.preguntas.map((p, idx) => (
          <PreguntaView
            key={p.id}
            numero={idx + 1}
            pregunta={p}
            respuesta={respuestas[p.id]}
            corregida={resultado !== null}
            acierto={resultado?.porPregunta[p.id] ?? false}
            onResponder={(r) => setRespuestas((prev) => ({ ...prev, [p.id]: r }))}
          />
        ))}
      </ol>

      <div className="flex flex-wrap gap-3 pb-4">
        {resultado ? (
          <button
            type="button"
            onClick={() => abrir(activo.id)}
            className="flex min-h-11 items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Repetir
          </button>
        ) : (
          <button
            type="button"
            onClick={corregir}
            className="min-h-11 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700"
          >
            Corregir ({respondidas}/{activo.preguntas.length} respondidas)
          </button>
        )}
        <button
          type="button"
          onClick={volverALista}
          className="min-h-11 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Otros supuestos
        </button>
      </div>
    </div>
  );
}

interface PreguntaViewProps {
  /** El repo no tiene @types/react: se declara `key` para poder usarlo en el map. */
  key?: string;
  numero: number;
  pregunta: PreguntaSupuesto;
  respuesta: RespuestaSupuesto;
  corregida: boolean;
  acierto: boolean;
  onResponder: (r: RespuestaSupuesto) => void;
}

function PreguntaView({ numero, pregunta: p, respuesta, corregida, acierto, onResponder }: PreguntaViewProps) {
  const url = enlaceOficial(p.fuente);
  const inputId = `${p.id}-valor`;
  return (
    <li className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm" data-pregunta-id={p.id}>
      <fieldset className="min-w-0 space-y-3" disabled={corregida}>
        <legend className="text-sm font-semibold leading-snug text-slate-800">
          <span className="mr-1 text-orange-600">{numero}.</span>
          {p.tipo === 'calculo' && <span className="mr-1 rounded bg-sky-100 px-1.5 text-[11px] font-bold text-sky-800">Cálculo</span>}
          {p.enunciado}
        </legend>

        {p.tipo === 'test' ? (
          <div className="space-y-2">
            {p.opciones.map((op, i) => {
              const elegida = respuesta === i;
              const esLaCorrecta = corregida && i === p.correcta;
              const fallada = corregida && elegida && i !== p.correcta;
              return (
                <label
                  key={i}
                  className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm leading-snug ${
                    esLaCorrecta
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : fallada
                        ? 'border-red-300 bg-red-50 text-red-900'
                        : elegida
                          ? 'border-orange-300 bg-orange-50 text-slate-800'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name={p.id}
                    value={i}
                    checked={elegida}
                    onChange={() => onResponder(i)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-orange-600"
                  />
                  <span className="min-w-0 break-words">
                    <span className="font-bold">{LETRAS[i]})</span> {op}
                  </span>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor={inputId} className="block text-xs font-semibold text-slate-600">
              Tu resultado ({p.unidad})
            </label>
            <div className="flex items-center gap-2">
              <input
                id={inputId}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={typeof respuesta === 'string' ? respuesta : ''}
                onChange={(e) => onResponder(e.target.value)}
                className="min-h-11 w-full max-w-[12rem] rounded-xl border border-slate-300 px-3 text-base text-slate-800"
              />
              <span className="text-sm text-slate-600">{p.unidad}</span>
            </div>
          </div>
        )}
      </fieldset>

      {corregida && (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-sm">
          <p className={`flex items-center gap-1.5 font-bold ${acierto ? 'text-emerald-700' : 'text-red-700'}`}>
            {acierto ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <XCircle className="h-4 w-4" aria-hidden="true" />}
            {acierto ? 'Correcta' : 'Incorrecta'}
            {p.tipo === 'test' && !acierto && <span className="font-normal text-slate-700"> · correcta: {LETRAS[p.correcta]}</span>}
            {p.tipo === 'calculo' && (
              <span className="font-normal text-slate-700">
                {' '}
                · resultado: {formatNumero(p.resultado)} {p.unidad}
              </span>
            )}
          </p>
          {p.tipo === 'calculo' && (
            <div className="rounded-xl bg-sky-50 p-3 text-slate-700">
              <p className="text-xs font-semibold text-sky-900">Fórmula: {p.formula}</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs">
                {p.pasos.map((paso, i) => (
                  <li key={i}>
                    {paso.descripcion}: {paso.operacion} = <strong>{formatNumero(paso.resultado)} {paso.unidad}</strong>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <p className="leading-relaxed text-slate-700">{p.explicacion}</p>
          <p className="text-xs text-slate-500">
            {p.localizacion}
            {url && (
              <>
                {' · '}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1 font-semibold text-indigo-600 underline"
                >
                  Fuente oficial <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </>
            )}
          </p>
        </div>
      )}
    </li>
  );
}
