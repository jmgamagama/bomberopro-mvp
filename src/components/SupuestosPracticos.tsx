import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, ClipboardList, ExternalLink, Lock, RotateCcw, Trash2, Upload, XCircle } from 'lucide-react';
import { getVisibleSupuestos, loadSupuestos } from '../data/supuestos/supuestosRegistry';
import type { PreguntaSupuesto, Supuesto } from '../data/supuestos/supuestosTypes';
import {
  corregirSupuesto,
  guardarResultado,
  leerUltimosResultados,
  type RespuestaSupuesto,
} from '../data/supuestos/supuestosCorreccion';
import {
  AlmacenamientoLlenoError,
  SUPUESTOS_PRIVADOS_EVENT,
  borrarSupuestoPrivado,
  borrarTodosSupuestosPrivados,
  getSupuestosCuenta,
  guardarSupuestosPrivados,
  leerSupuestosPrivados,
} from '../data/supuestos/supuestosPrivados';
import { MAX_BYTES_IMPORT, validarArchivoSupuestos } from '../data/supuestos/supuestosImport';
import { tipoFuente } from '../data/supuestos/supuestosAudit';

interface SupuestosPracticosProps {
  onNavigateHome: () => void;
}

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

function enlace(fuente: string): string | null {
  return fuente.match(/https?:\/\/[^\s)]+/)?.[0] ?? null;
}

/** Etiqueta del enlace: solo «Fuente oficial» si el dominio es oficial (los educativos se marcan como tales). */
function etiquetaFuente(url: string): string {
  const tipo = tipoFuente(url);
  return tipo === 'oficial' ? 'Fuente oficial' : tipo === 'educativa' ? 'Fuente educativa' : 'Fuente';
}

function formatNumero(n: number): string {
  return n.toLocaleString('es-ES', { maximumFractionDigits: 3 });
}

type Activo = { origen: 'app' | 'privado' | 'cuenta'; id: string };
type ImportEstado = { tipo: 'ok'; texto: string } | { tipo: 'error'; errores: string[] } | null;

export default function SupuestosPracticos({ onNavigateHome }: SupuestosPracticosProps) {
  const visibles = useMemo(() => getVisibleSupuestos(), []);
  const [contenido, setContenido] = useState<readonly Supuesto[] | null>(visibles.length ? null : []);
  const [error, setError] = useState(false);
  const [privados, setPrivados] = useState<Supuesto[]>(() => leerSupuestosPrivados());
  // Supuestos de la cuenta en el servidor (private_supuestos): solo lectura, solo en memoria.
  const [cuenta, setCuenta] = useState<Supuesto[]>(() => getSupuestosCuenta());
  const [activo, setActivo] = useState<Activo | null>(null);
  const [respuestas, setRespuestas] = useState<Record<string, RespuestaSupuesto>>({});
  const [autoeval, setAutoeval] = useState<Record<string, boolean>>({});
  const [corregido, setCorregido] = useState(false);
  const [ultimos, setUltimos] = useState(() => leerUltimosResultados());
  const [importEstado, setImportEstado] = useState<ImportEstado>(null);
  const [confirmarBorrar, setConfirmarBorrar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!visibles.length) return;
    let vivo = true;
    loadSupuestos()
      .then((lista) => vivo && setContenido(lista))
      .catch(() => vivo && setError(true));
    return () => {
      vivo = false;
    };
  }, [visibles.length]);

  useEffect(() => {
    const refrescar = () => {
      setPrivados(leerSupuestosPrivados());
      setCuenta(getSupuestosCuenta());
    };
    window.addEventListener(SUPUESTOS_PRIVADOS_EVENT, refrescar);
    window.addEventListener('storage', refrescar);
    return () => {
      window.removeEventListener(SUPUESTOS_PRIVADOS_EVENT, refrescar);
      window.removeEventListener('storage', refrescar);
    };
  }, []);

  const supuesto: Supuesto | null = !activo
    ? null
    : activo.origen === 'privado'
      ? privados.find((s) => s.id === activo.id) ?? null
      : activo.origen === 'cuenta'
        ? cuenta.find((s) => s.id === activo.id) ?? null
      : contenido?.find((s) => s.id === activo.id && visibles.some((v) => v.id === s.id)) ?? null;

  const resultado = supuesto && corregido ? corregirSupuesto(supuesto, respuestas, autoeval) : null;
  const claveResultado = (a: Activo) => (a.origen === 'app' ? a.id : `${a.origen}:${a.id}`);

  // Guarda el último resultado (también al cambiar la autoevaluación de una pregunta de desarrollo).
  useEffect(() => {
    if (!activo || !supuesto || !corregido) return;
    guardarResultado(claveResultado(activo), corregirSupuesto(supuesto, respuestas, autoeval));
    setUltimos(leerUltimosResultados());
  }, [corregido, autoeval]);

  const abrir = (a: Activo) => {
    setActivo(a);
    setRespuestas({});
    setAutoeval({});
    setCorregido(false);
    setConfirmarBorrar(null);
    window.scrollTo?.({ top: 0 });
  };

  const corregir = () => {
    setCorregido(true);
    window.scrollTo?.({ top: 0 });
  };

  const volverALista = () => {
    setActivo(null);
    setCorregido(false);
    setRespuestas({});
    setAutoeval({});
  };

  const importar = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_BYTES_IMPORT) {
      setImportEstado({ tipo: 'error', errores: ['El archivo es demasiado grande (máximo 2 MB).'] });
      return;
    }
    const texto = await file.text();
    const r = validarArchivoSupuestos(texto);
    if ('errores' in r) {
      setImportEstado({ tipo: 'error', errores: r.errores });
      return;
    }
    try {
      const { nuevos, sustituidos } = guardarSupuestosPrivados(r.supuestos);
      setPrivados(leerSupuestosPrivados());
      setImportEstado({
        tipo: 'ok',
        texto: `Importados ${r.supuestos.length} supuestos de «${file.name}» (${nuevos} nuevos${sustituidos ? `, ${sustituidos} sustituidos` : ''}).`,
      });
    } catch (e) {
      setImportEstado({ tipo: 'error', errores: [e instanceof AlmacenamientoLlenoError ? e.message : 'No se han podido guardar los supuestos.'] });
    }
  };

  const borrar = (id: string) => {
    if (id === '*') borrarTodosSupuestosPrivados();
    else borrarSupuestoPrivado(id);
    setPrivados(leerSupuestosPrivados());
    setConfirmarBorrar(null);
    setImportEstado(null);
  };

  if (!supuesto) {
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
                      onClick={() => abrir({ origen: 'app', id: s.id })}
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
        </section>

        <section
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8"
          aria-labelledby="mis-supuestos-titulo"
          id="mis-supuestos"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 id="mis-supuestos-titulo" className="text-lg font-black text-slate-800">
                Mis supuestos (privado)
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600" id="aviso-privado">
                <strong>Material personal que no se comparte.</strong> El archivo se lee y se guarda solo en este
                navegador y para esta cuenta. No se envía a ningún servidor, no se sincroniza con otros dispositivos ni
                lo ven otros usuarios. Si borras los datos del navegador, se pierde.
              </p>
            </div>
          </div>

          <div>
            <input
              ref={fileRef}
              id="supuestos-import-input"
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(e) => {
                void importar(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            <label
              htmlFor="supuestos-import-input"
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <Upload className="h-4 w-4" aria-hidden="true" /> Importar archivo JSON
            </label>
            <p className="mt-2 text-[11px] text-slate-500">
              Archivo JSON con formato «bomberopro-supuestos», versión 1. Máximo 2 MB.
            </p>
          </div>

          {importEstado?.tipo === 'ok' && (
            <p className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-900" role="status" id="import-ok">
              {importEstado.texto}
            </p>
          )}
          {importEstado?.tipo === 'error' && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-900" role="alert" id="import-errores">
              <p className="font-bold">No se ha importado nada. Corrige el archivo:</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs break-words">
                {importEstado.errores.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {cuenta.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs leading-relaxed text-slate-600" id="aviso-cuenta">
                Los marcados «En tu cuenta» están guardados para tu usuario: solo los puede leer tu cuenta, no se
                pueden borrar desde aquí y no se guardan en el dispositivo.
              </p>
              <ul className="space-y-3" aria-label="Supuestos de mi cuenta">
                {cuenta.map((s) => {
                  const ultimo = ultimos[`cuenta:${s.id}`];
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => abrir({ origen: 'cuenta', id: s.id })}
                        data-cuenta-id={s.id}
                        className="min-h-11 w-full rounded-xl border border-indigo-100 bg-indigo-50/40 px-4 py-3 text-left"
                      >
                        <span className="block text-sm font-semibold text-slate-800 break-words">{s.titulo}</span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {s.temas.length ? `${s.temas.map((t) => `T${t}`).join(' · ')} · ` : ''}
                          {s.preguntas.length} preguntas{ultimo ? ` · último: ${ultimo.aciertos}/${ultimo.total}` : ''}
                        </span>
                        <span className="mt-2 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-800">
                          En tu cuenta · solo tú
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {privados.length > 0 && (
            <>
              <ul className="space-y-3" aria-label="Mis supuestos privados">
                {privados.map((s) => {
                  const ultimo = ultimos[`privado:${s.id}`];
                  return (
                    <li key={s.id} className="rounded-xl border border-slate-200 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => abrir({ origen: 'privado', id: s.id })}
                        data-privado-id={s.id}
                        className="min-h-11 w-full px-4 pt-3 text-left"
                      >
                        <span className="block text-sm font-semibold text-slate-800 break-words">{s.titulo}</span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {s.temas.length ? `${s.temas.map((t) => `T${t}`).join(' · ')} · ` : ''}
                          {s.preguntas.length} preguntas{ultimo ? ` · último: ${ultimo.aciertos}/${ultimo.total}` : ''}
                        </span>
                      </button>
                      <div className="flex flex-wrap items-center gap-2 px-2 pb-1">
                        {confirmarBorrar === s.id ? (
                          <>
                            <span className="px-2 text-xs text-slate-700">¿Borrar este supuesto?</span>
                            <button type="button" onClick={() => borrar(s.id)} className="min-h-11 px-3 text-xs font-bold text-red-700">
                              Sí, borrar
                            </button>
                            <button type="button" onClick={() => setConfirmarBorrar(null)} className="min-h-11 px-3 text-xs font-semibold text-slate-600">
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmarBorrar(s.id)}
                            aria-label={`Borrar «${s.titulo}»`}
                            className="inline-flex min-h-11 items-center gap-1 px-2 text-xs font-semibold text-slate-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" /> Borrar
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {confirmarBorrar === '*' ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-700">¿Borrar todos tus supuestos privados de este dispositivo?</span>
                  <button type="button" onClick={() => borrar('*')} className="min-h-11 px-3 text-xs font-bold text-red-700">
                    Sí, borrar todos
                  </button>
                  <button type="button" onClick={() => setConfirmarBorrar(null)} className="min-h-11 px-3 text-xs font-semibold text-slate-600">
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmarBorrar('*')}
                  className="inline-flex min-h-11 items-center gap-1 px-2 text-xs font-semibold text-red-700"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" /> Borrar todos mis supuestos privados
                </button>
              )}
            </>
          )}
        </section>

        <button type="button" onClick={onNavigateHome} className="min-h-11 px-2 text-xs font-semibold text-slate-500 hover:text-slate-700">
          Volver al inicio
        </button>
      </div>
    );
  }

  const esPrivado = supuesto.autoria === 'privado';
  const respondidas = supuesto.preguntas.filter((p) => {
    const r = respuestas[p.id];
    return r !== undefined && r !== '';
  }).length;
  const pendientesAutoeval = resultado
    ? supuesto.preguntas.filter((p) => p.tipo === 'desarrollo' && autoeval[p.id] === undefined).length
    : 0;

  return (
    <div className="mx-auto mt-4 max-w-3xl space-y-5 sm:mt-8" id="supuestos-root">
      <section className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
          {esPrivado ? 'Mi supuesto (privado)' : 'Supuesto práctico'}
          {supuesto.temas.length ? ` · ${supuesto.temas.map((t) => `Tema ${t}`).join(' · ')}` : ''}
        </p>
        <h2 className="text-lg font-bold text-slate-800 break-words">{supuesto.titulo}</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 break-words">{supuesto.enunciado}</p>
        <p className="text-[11px] text-slate-500 break-words">
          {activo?.origen === 'cuenta'
            ? 'Material personal de tu cuenta (no se comparte).'
            : esPrivado
              ? 'Material personal importado en este dispositivo (no se comparte).'
              : 'Caso original.'}{' '}
          Fuentes:{' '}
          {supuesto.fuentes.join('; ')}.
        </p>
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
          {pendientesAutoeval > 0 && (
            <p className="text-xs font-semibold text-amber-800">
              Te quedan {pendientesAutoeval} preguntas de desarrollo por autoevaluar.
            </p>
          )}
          <p className="text-[11px] text-slate-500">
            No es la nota oficial: el tribunal califica de 0 a 10 la respuesta razonada.
          </p>
        </section>
      )}

      <ol className="space-y-4">
        {supuesto.preguntas.map((p, idx) => (
          <PreguntaView
            key={p.id}
            numero={idx + 1}
            pregunta={p}
            respuesta={respuestas[p.id]}
            corregida={resultado !== null}
            acierto={resultado?.porPregunta[p.id] ?? false}
            autoevaluacion={autoeval[p.id]}
            privado={esPrivado}
            onResponder={(r) => setRespuestas((prev) => ({ ...prev, [p.id]: r }))}
            onAutoevaluar={(ok) => setAutoeval((prev) => ({ ...prev, [p.id]: ok }))}
          />
        ))}
      </ol>

      <div className="flex flex-wrap gap-3 pb-4">
        {resultado ? (
          <button
            type="button"
            onClick={() => activo && abrir(activo)}
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
            Corregir ({respondidas}/{supuesto.preguntas.length} respondidas)
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
  autoevaluacion: boolean | undefined;
  /** Supuesto privado: su enlace no se presenta como «oficial». */
  privado: boolean;
  onResponder: (r: RespuestaSupuesto) => void;
  onAutoevaluar: (ok: boolean) => void;
}

function PreguntaView({ numero, pregunta: p, respuesta, corregida, acierto, autoevaluacion, privado, onResponder, onAutoevaluar }: PreguntaViewProps) {
  const url = enlace(p.fuente);
  const inputId = `${p.id}-valor`;
  return (
    <li className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm" data-pregunta-id={p.id}>
      <fieldset className="min-w-0 space-y-3" disabled={corregida}>
        <legend className="text-sm font-semibold leading-snug text-slate-800 break-words">
          <span className="mr-1 text-orange-600">{numero}.</span>
          {p.tipo === 'calculo' && <span className="mr-1 rounded bg-indigo-100 px-1.5 text-[11px] font-bold text-indigo-800">Cálculo</span>}
          {p.tipo === 'desarrollo' && <span className="mr-1 rounded bg-indigo-100 px-1.5 text-[11px] font-bold text-indigo-800">Desarrollo</span>}
          {p.enunciado}
        </legend>

        {p.tipo === 'test' && (
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
        )}
        {p.tipo === 'calculo' && (
          <div className="space-y-2">
            <label htmlFor={inputId} className="block text-xs font-semibold text-slate-600">
              Tu resultado{p.unidad ? ` (${p.unidad})` : ''}
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
        {p.tipo === 'desarrollo' && (
          <div className="space-y-2">
            <label htmlFor={inputId} className="block text-xs font-semibold text-slate-600">
              Tu respuesta (se compara con la respuesta modelo al corregir)
            </label>
            <textarea
              id={inputId}
              rows={4}
              value={typeof respuesta === 'string' ? respuesta : ''}
              onChange={(e) => onResponder(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-base text-slate-800"
            />
          </div>
        )}
      </fieldset>

      {corregida && (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-sm">
          {p.tipo === 'desarrollo' ? (
            <>
              <div className="rounded-xl bg-indigo-50 p-3 text-slate-800">
                <p className="text-xs font-semibold text-indigo-900">Respuesta modelo</p>
                <p className="mt-1 whitespace-pre-line break-words">{p.respuestaModelo}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label={`Autoevaluación de la pregunta ${numero}`}>
                <button
                  type="button"
                  aria-pressed={autoevaluacion === true}
                  onClick={() => onAutoevaluar(true)}
                  className={`min-h-11 rounded-xl border px-3 text-xs font-bold ${autoevaluacion === true ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-700'}`}
                >
                  La tenía bien
                </button>
                <button
                  type="button"
                  aria-pressed={autoevaluacion === false}
                  onClick={() => onAutoevaluar(false)}
                  className={`min-h-11 rounded-xl border px-3 text-xs font-bold ${autoevaluacion === false ? 'border-red-400 bg-red-50 text-red-800' : 'border-slate-200 text-slate-700'}`}
                >
                  La tenía mal
                </button>
              </div>
            </>
          ) : (
            <p className={`flex flex-wrap items-center gap-1.5 font-bold ${acierto ? 'text-emerald-700' : 'text-red-700'}`}>
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
          )}
          {p.tipo === 'calculo' && (p.formula || p.pasos.length > 0) && (
            <div className="rounded-xl bg-indigo-50 p-3 text-slate-700">
              {p.formula && <p className="text-xs font-semibold text-indigo-900">Fórmula: {p.formula}</p>}
              {p.pasos.length > 0 && (
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs">
                  {p.pasos.map((paso, i) => (
                    <li key={i}>
                      {paso.descripcion}
                      {paso.operacion ? `: ${paso.operacion}` : ''} = <strong>{formatNumero(paso.resultado)} {paso.unidad}</strong>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
          {p.explicacion && <p className="leading-relaxed text-slate-700 break-words">{p.explicacion}</p>}
          <p className="text-xs text-slate-500 break-words">
            {p.localizacion || p.fuente}
            {url && (
              <>
                {' · '}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1 font-semibold text-indigo-600 underline"
                >
                  {privado ? 'Fuente' : etiquetaFuente(url)}{' '}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </>
            )}
          </p>
        </div>
      )}
    </li>
  );
}
