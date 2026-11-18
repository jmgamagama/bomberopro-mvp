import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CLASE_VACIA, GUION_CLASE, borrarClase, duplicarClase, formatearFechaClase, getClasesTutor, getDetalleClase,
  guardarClase, preparacionClase, textoWhatsApp,
  type AlumnoClase, type ClaseTutor, type DatosClase, type EstadoClase,
} from '../lib/tutor';
import { pedirTemas, temasEnCache, type TemaNombre } from '../lib/temasCache';
import Skeleton from './Skeleton';

const ESTADOS: { valor: EstadoClase; texto: string; clase: string }[] = [
  { valor: 'borrador', texto: 'Borrador', clase: 'bg-slate-100 text-slate-700' },
  { valor: 'preparada', texto: 'Preparada', clase: 'bg-emerald-100 text-emerald-800' },
  { valor: 'impartida', texto: 'Impartida', clase: 'bg-indigo-100 text-indigo-800' },
];

/** Fecha ISO → valor de <input type="datetime-local"> en hora local. */
function aInputLocal(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function aDatos(c: ClaseTutor): DatosClase {
  return {
    titulo: c.titulo, fecha: c.fecha, lugar: c.lugar ?? '', temas: c.temas, estado: c.estado,
    aviso_alumnos: c.aviso_alumnos ?? '', notas_tutor: c.notas_tutor ?? '', enlaces: c.enlaces,
    pide_lectura: c.pide_lectura, funciono: c.funciono,
  };
}

/** Clases del tutor: prepararlas, avisar a los alumnos, ver quién ha leído y repetir las que funcionaron. */
export default function ClasesTutor() {
  const [clases, setClases] = useState<ClaseTutor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState<{ id: number | null; datos: DatosClase } | null>(null);

  const cargar = useCallback(async () => {
    try { setClases(await getClasesTutor()); setError(null); } catch { setClases([]); setError('No se pudieron cargar las clases. Inténtalo de nuevo en un momento.'); }
  }, []);
  useEffect(() => { void cargar(); }, [cargar]);

  const duplicar = async (c: ClaseTutor) => {
    try {
      const r = await duplicarClase(c.id);
      await cargar();
      const lista = await getClasesTutor();
      const nueva = lista.find(x => x.id === r.id);
      if (nueva) setEditando({ id: nueva.id, datos: aDatos(nueva) });
    } catch { setError('No se pudo duplicar la clase.'); }
  };

  if (editando) {
    return (
      <EditorClase
        id={editando.id}
        inicial={editando.datos}
        clase={clases?.find(c => c.id === editando.id) ?? null}
        onCerrar={() => { setEditando(null); void cargar(); }}
        onDuplicar={c => void duplicar(c)}
      />
    );
  }

  const futuras = clases?.filter(c => c.estado !== 'impartida') ?? [];
  const impartidas = clases?.filter(c => c.estado === 'impartida') ?? [];

  return (
    <div data-testid="clases-tutor">
      <p className="mb-3 text-sm text-slate-700">
        Prepara cada clase en un solo sitio: temas, material y aviso para los alumnos. Ellos confirman la lectura desde su móvil y tú llegas sabiendo quién viene preparado.
      </p>
      <button type="button" onClick={() => setEditando({ id: null, datos: CLASE_VACIA })} className="mb-4 min-h-11 rounded-lg bg-indigo-700 px-4 text-sm font-bold text-white">
        + Nueva clase
      </button>
      {error && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {clases === null && <Skeleton label="Cargando clases…" block={false} />}
      {clases?.length === 0 && !error && <p className="text-sm text-slate-500">Todavía no has creado ninguna clase.</p>}
      <Lista titulo="Próximas y borradores" clases={futuras} onAbrir={c => setEditando({ id: c.id, datos: aDatos(c) })} />
      <Lista titulo="Impartidas" clases={impartidas} onAbrir={c => setEditando({ id: c.id, datos: aDatos(c) })} onDuplicar={c => void duplicar(c)} />
    </div>
  );
}

function Lista({ titulo, clases, onAbrir, onDuplicar }: { titulo: string; clases: ClaseTutor[]; onAbrir: (c: ClaseTutor) => void; onDuplicar?: (c: ClaseTutor) => void }) {
  if (clases.length === 0) return null;
  return (
    <section className="mb-5">
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-600">{titulo}</h3>
      <ul className="space-y-2">
        {clases.map(c => {
          const est = ESTADOS.find(e => e.valor === c.estado)!;
          return (
            <li key={c.id} className="rounded-xl border border-slate-200 bg-white p-3">
              <button type="button" onClick={() => onAbrir(c)} className="w-full text-left">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{c.titulo}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${est.clase}`}>{est.texto}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {formatearFechaClase(c.fecha)}{c.temas.length > 0 ? ` · ${c.temas.map(t => `T${t}`).join(', ')}` : ''}
                  {c.pide_lectura && c.estado !== 'borrador' ? ` · ${c.leidos} de ${c.alumnos} han leído` : ''}
                  {c.estado === 'impartida' && c.funciono === true ? ' · Funcionó' : ''}
                  {c.estado === 'impartida' && c.funciono === false ? ' · A mejorar' : ''}
                </p>
              </button>
              {onDuplicar && (
                <button type="button" onClick={() => onDuplicar(c)} className="mt-2 min-h-11 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Repetir esta clase
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function EditorClase({ id, inicial, clase, onCerrar, onDuplicar }: {
  id: number | null; inicial: DatosClase; clase: ClaseTutor | null; onCerrar: () => void; onDuplicar: (c: ClaseTutor) => void;
}) {
  const [form, setForm] = useState<DatosClase>(inicial);
  const [temas, setTemas] = useState<TemaNombre[]>(() => temasEnCache() ?? []);
  const [detalle, setDetalle] = useState<AlumnoClase[] | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const set = <K extends keyof DatosClase>(k: K, v: DatosClase[K]) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { void pedirTemas().then(t => { if (t) setTemas(t); }); }, []);
  useEffect(() => {
    if (id == null) return;
    let vivo = true;
    getDetalleClase(id).then(d => { if (vivo) setDetalle(d.alumnos); }).catch(() => { if (vivo) setDetalle([]); });
    return () => { vivo = false; };
  }, [id]);

  const elegidos = useMemo(() => temas.filter(t => form.temas.includes(t.numero)), [temas, form.temas]);
  const checklist = preparacionClase(form);
  const listos = checklist.filter(x => x.hecho).length;
  const texto = textoWhatsApp(form, elegidos);

  const alternarTema = (n: number) => set('temas', form.temas.includes(n) ? form.temas.filter(x => x !== n) : [...form.temas, n].slice(0, 10));
  const cambiarEnlace = (i: number, campo: 'titulo' | 'url', v: string) => set('enlaces', form.enlaces.map((e, j) => (j === i ? { ...e, [campo]: v } : e)));

  const guardar = async () => {
    if (!form.titulo.trim()) { setAviso({ tipo: 'error', texto: 'Ponle un título a la clase.' }); return; }
    const enlaces = form.enlaces.filter(e => e.url.trim());
    if (enlaces.some(e => !/^https:\/\/\S+$/.test(e.url.trim()))) { setAviso({ tipo: 'error', texto: 'Los enlaces deben empezar por https://' }); return; }
    setOcupado(true); setAviso(null);
    try {
      await guardarClase(id, { ...form, enlaces: enlaces.map(e => ({ titulo: e.titulo.trim(), url: e.url.trim() })) });
      onCerrar();
    } catch { setAviso({ tipo: 'error', texto: 'No se pudo guardar. Inténtalo de nuevo.' }); setOcupado(false); }
  };

  const borrar = async () => {
    if (id == null || !window.confirm('¿Eliminar esta clase? Se borran también las lecturas de los alumnos.')) return;
    setOcupado(true);
    try { await borrarClase(id); onCerrar(); } catch { setAviso({ tipo: 'error', texto: 'No se pudo eliminar.' }); setOcupado(false); }
  };

  const copiar = async () => {
    try { await navigator.clipboard.writeText(texto); setAviso({ tipo: 'ok', texto: 'Texto copiado. Pégalo en el grupo de WhatsApp.' }); }
    catch { setAviso({ tipo: 'error', texto: 'No se pudo copiar. Usa «Enviar por WhatsApp».' }); }
  };

  const campo = 'min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base';

  return (
    <div data-testid="editor-clase">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">{id == null ? 'Nueva clase' : 'Editar clase'}</h3>
        <button type="button" onClick={onCerrar} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">Volver a clases</button>
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3" aria-label="Estado de preparación">
        <p className="text-sm font-semibold text-slate-900">Preparación: {listos} de {checklist.length}</p>
        <ul className="mt-1 grid gap-0.5 text-sm sm:grid-cols-2">
          {checklist.map(x => (
            <li key={x.etiqueta} className={x.hecho ? 'text-emerald-700' : 'text-slate-500'}>{x.hecho ? '✓' : '○'} {x.etiqueta}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="clase-titulo" className="mb-1 block text-sm font-semibold text-slate-900">Título</label>
          <input id="clase-titulo" value={form.titulo} onChange={e => set('titulo', e.target.value)} maxLength={120} className={campo} placeholder="Ej. Constitución: derechos y deberes" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="clase-fecha" className="mb-1 block text-sm font-semibold text-slate-900">Fecha y hora</label>
            <input id="clase-fecha" type="datetime-local" value={aInputLocal(form.fecha)} onChange={e => set('fecha', e.target.value ? new Date(e.target.value).toISOString() : null)} className={campo} />
          </div>
          <div>
            <label htmlFor="clase-lugar" className="mb-1 block text-sm font-semibold text-slate-900">Lugar</label>
            <input id="clase-lugar" value={form.lugar} onChange={e => set('lugar', e.target.value)} maxLength={120} className={campo} placeholder="Aula, parque, online…" />
          </div>
        </div>

        <fieldset>
          <legend className="mb-1 text-sm font-semibold text-slate-900">Temas de la clase</legend>
          <div className="flex flex-wrap gap-2">
            {temas.map(t => {
              const on = form.temas.includes(t.numero);
              return (
                <button key={t.numero} type="button" aria-pressed={on} onClick={() => alternarTema(t.numero)}
                  className={`min-h-11 rounded-lg border px-3 text-sm font-semibold ${on ? 'border-indigo-700 bg-indigo-700 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
                  T{t.numero} · {t.nombre}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="clase-aviso" className="mb-1 block text-sm font-semibold text-slate-900">Aviso para los alumnos</label>
          <textarea id="clase-aviso" value={form.aviso_alumnos} onChange={e => set('aviso_alumnos', e.target.value)} maxLength={600} rows={3} className={`${campo} py-2`} placeholder="Qué traer, cambio de hora, qué repasar antes…" />
        </div>

        <fieldset>
          <legend className="mb-1 text-sm font-semibold text-slate-900">Material (Drive, NotebookLM, presentaciones…)</legend>
          {form.enlaces.map((e, i) => (
            <div key={i} className="mb-2 grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
              <input aria-label={`Nombre del enlace ${i + 1}`} value={e.titulo} onChange={ev => cambiarEnlace(i, 'titulo', ev.target.value)} maxLength={80} className={campo} placeholder="Nombre" />
              <input aria-label={`Dirección del enlace ${i + 1}`} value={e.url} onChange={ev => cambiarEnlace(i, 'url', ev.target.value)} className={campo} placeholder="https://…" inputMode="url" />
              <button type="button" onClick={() => set('enlaces', form.enlaces.filter((_, j) => j !== i))} className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700">Quitar</button>
            </div>
          ))}
          {form.enlaces.length < 6 && (
            <button type="button" onClick={() => set('enlaces', [...form.enlaces, { titulo: '', url: '' }])} className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700">+ Añadir enlace</button>
          )}
        </fieldset>

        <label className="flex min-h-11 items-center gap-3 text-sm text-slate-800">
          <input type="checkbox" checked={form.pide_lectura} onChange={e => set('pide_lectura', e.target.checked)} className="h-5 w-5" />
          Pedir ficha de lectura: el alumno confirma «He leído el tema» antes de la clase
        </label>

        <div>
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="clase-notas" className="text-sm font-semibold text-slate-900">Tus notas (los alumnos no las ven)</label>
            <button type="button" onClick={() => set('notas_tutor', form.notas_tutor.trim() ? `${form.notas_tutor.trim()}\n\n${GUION_CLASE}` : GUION_CLASE)} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
              Insertar guion sugerido
            </button>
          </div>
          <textarea id="clase-notas" value={form.notas_tutor} onChange={e => set('notas_tutor', e.target.value)} maxLength={2000} rows={5} className={`${campo} py-2`} placeholder="Repaso oral, simulacro en clase, ejercicios en papel, comentarios para salir de la pantalla…" />
        </div>

        <fieldset>
          <legend className="mb-1 text-sm font-semibold text-slate-900">Estado</legend>
          <div className="flex flex-wrap gap-2">
            {ESTADOS.map(e => (
              <button key={e.valor} type="button" aria-pressed={form.estado === e.valor} onClick={() => set('estado', e.valor)}
                className={`min-h-11 rounded-lg border px-4 text-sm font-semibold ${form.estado === e.valor ? 'border-indigo-700 bg-indigo-700 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
                {e.texto}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">Los alumnos solo ven las clases en estado «Preparada».</p>
        </fieldset>

        {form.estado === 'impartida' && (
          <fieldset>
            <legend className="mb-1 text-sm font-semibold text-slate-900">¿Cómo fue la clase?</legend>
            <div className="flex gap-2">
              <button type="button" aria-pressed={form.funciono === true} onClick={() => set('funciono', true)} className={`min-h-11 rounded-lg border px-4 text-sm font-semibold ${form.funciono === true ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>Funcionó</button>
              <button type="button" aria-pressed={form.funciono === false} onClick={() => set('funciono', false)} className={`min-h-11 rounded-lg border px-4 text-sm font-semibold ${form.funciono === false ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>A mejorar</button>
            </div>
          </fieldset>
        )}
      </div>

      {aviso && <p role="status" className={`mt-4 rounded-lg p-3 text-sm ${aviso.tipo === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>{aviso.texto}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" disabled={ocupado} onClick={() => void guardar()} className="min-h-11 rounded-lg bg-indigo-700 px-5 text-sm font-bold text-white disabled:opacity-50">Guardar clase</button>
        {clase && <button type="button" disabled={ocupado} onClick={() => onDuplicar(clase)} className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700">Repetir esta clase</button>}
        {id != null && <button type="button" disabled={ocupado} onClick={() => void borrar()} className="min-h-11 rounded-lg border border-red-300 px-4 text-sm font-semibold text-red-700">Eliminar</button>}
      </div>

      {form.titulo.trim() && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <p className="mb-1 text-sm font-semibold text-slate-900">Aviso para el grupo de WhatsApp</p>
          <pre className="mb-2 whitespace-pre-wrap break-words text-sm text-slate-800" data-testid="texto-whatsapp">{texto}</pre>
          <div className="flex flex-wrap gap-2">
            <a href={`https://wa.me/?text=${encodeURIComponent(texto)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white">Enviar por WhatsApp</a>
            <button type="button" onClick={() => void copiar()} className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700">Copiar texto</button>
          </div>
        </div>
      )}

      {id != null && (
        <div className="mt-5">
          <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-600">Alumnos</h4>
          {detalle === null && <Skeleton label="Cargando alumnos…" block={false} />}
          {detalle?.length === 0 && <p className="text-sm text-slate-500">Todavía no hay alumnos vinculados.</p>}
          <ul className="space-y-2">
            {detalle?.map(a => (
              <li key={a.alumno_id} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{a.email ?? 'Alumno'}</p>
                  {form.pide_lectura && (
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${a.leido_at ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{a.leido_at ? 'Ha leído' : 'Sin leer'}</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {form.temas.length === 0 ? 'Elige temas para ver sus resultados.' : a.respuestas === 0 ? 'Sin respuestas en estos temas (últimos 30 días).' : `${a.respuestas} respuestas en estos temas · ${a.aciertos_pct == null ? 'sin aciertos medidos' : `${a.aciertos_pct} % aciertos`}`}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
