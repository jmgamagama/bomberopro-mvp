import { useEffect, useState, type FormEvent } from 'react';
import { formatearFechaClase, getClasesAlumno, getMisTutores, marcarClaseLeida, revocarTutor, vincularTutor, type ClaseAlumno, type TutorVinculado } from '../lib/tutor';
import Skeleton from './Skeleton';

const MENSAJES = {
  codigo_invalido: 'Ese código no es válido. Revisa que lo hayas copiado entero.',
  propio: 'No puedes usar tu propio código.',
  limite: 'Demasiados intentos. Espera una hora y vuelve a probar.',
  error: 'No se pudo comprobar el código ahora. Inténtalo de nuevo en un momento.',
} as const;

/** El alumno decide si comparte su progreso con un tutor, y puede dejar de hacerlo cuando quiera. */
export default function MiTutor({ onExit }: { onExit: () => void }) {
  const [tutores, setTutores] = useState<TutorVinculado[] | null>(null);
  const [codigo, setCodigo] = useState('');
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [clases, setClases] = useState<ClaseAlumno[]>([]);

  const cargarClases = async () => {
    try {
      const r = await getClasesAlumno();
      setClases(Array.isArray(r) ? r.filter(c => c && typeof c.titulo === 'string') : []);
    } catch { setClases([]); }
  };

  const leida = async (c: ClaseAlumno) => {
    setClases(prev => prev.map(x => (x.id === c.id ? { ...x, leida: true } : x)));
    try { await marcarClaseLeida(c.id); } catch { setClases(prev => prev.map(x => (x.id === c.id ? { ...x, leida: false } : x))); setAviso({ tipo: 'error', texto: 'No se pudo guardar. Inténtalo de nuevo.' }); }
  };

  const cargar = async () => {
    try { const t = await getMisTutores(); setTutores(t); if (t.length > 0) void cargarClases(); else setClases([]); } catch { setTutores([]); setAviso({ tipo: 'error', texto: 'No se pudo cargar tu lista de tutores.' }); }
  };
  useEffect(() => { void cargar(); }, []);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!codigo.trim() || ocupado) return;
    setOcupado(true);
    setAviso(null);
    const r = await vincularTutor(codigo);
    if (r.ok) {
      setCodigo('');
      setAviso({ tipo: 'ok', texto: `Listo. ${r.tutor_nombre} ya puede ver tu progreso.` });
      await cargar();
    } else {
      setAviso({ tipo: 'error', texto: MENSAJES[(r as { motivo: keyof typeof MENSAJES }).motivo] });
    }
    setOcupado(false);
  };

  const dejar = async (t: TutorVinculado) => {
    if (!window.confirm(`¿Dejar de compartir tu progreso con ${t.nombre}?`)) return;
    setOcupado(true);
    try { await revocarTutor(t.tutor_id); setAviso({ tipo: 'ok', texto: `${t.nombre} ya no ve tu progreso.` }); } catch { setAviso({ tipo: 'error', texto: 'No se pudo completar. Inténtalo de nuevo.' }); }
    await cargar();
    setOcupado(false);
  };

  return (
    <div className="mx-auto max-w-2xl p-4" data-testid="mi-tutor">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Mi tutor</h2>
        <button type="button" onClick={onExit} className="min-h-11 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Volver</button>
      </div>
      <p className="mb-3 text-sm text-slate-700">
        Estudia acompañado: tu profesor ve cómo avanzas, te prepara cada clase y te avisa de lo que toca. Introduce su código para unirte.
      </p>
      <details className="mb-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
        <summary className="cursor-pointer font-semibold text-slate-900">¿Qué ve mi tutor?</summary>
        <p className="mt-2">Tu correo, tus días de estudio, el tiempo estimado que respondes y tus aciertos, fallos y dudas por tema.</p>
        <p className="mt-1">No ve tu contraseña, datos de pago ni el contenido de tus respuestas. Puedes dejar de compartir cuando quieras.</p>
      </details>

      {aviso && (
        <p role="status" className={`mb-4 rounded-lg p-3 text-sm ${aviso.tipo === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>{aviso.texto}</p>
      )}

      {clases.length > 0 && (
        <section className="mb-6" aria-label="Próximas clases" data-testid="proximas-clases">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-600">Próximas clases</h3>
          <ul className="space-y-3">
            {clases.map(c => (
              <li key={c.id} className="rounded-xl border border-indigo-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Con {c.tutor_nombre}</p>
                <p className="text-lg font-bold text-slate-900">{c.titulo}</p>
                <p className="text-sm text-slate-700">{formatearFechaClase(c.fecha)}{c.lugar ? ` · ${c.lugar}` : ''}</p>
                {c.temas.length > 0 && <p className="mt-1 text-sm text-slate-700">Temas: {c.temas.map(t => `T${t.numero} · ${t.nombre}`).join('; ')}</p>}
                {c.aviso_alumnos && <p className="mt-2 rounded-lg bg-amber-50 p-2 text-sm text-amber-900">{c.aviso_alumnos}</p>}
                {c.enlaces.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {c.enlaces.map(e => (
                      <li key={e.url}><a href={e.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm font-semibold text-indigo-700 underline">{e.titulo || 'Material de la clase'}</a></li>
                    ))}
                  </ul>
                )}
                {c.pide_lectura && (c.leida
                  ? <p className="mt-2 text-sm font-semibold text-emerald-700">✓ Tema leído</p>
                  : <button type="button" onClick={() => void leida(c)} className="mt-2 min-h-11 rounded-lg bg-indigo-700 px-4 text-sm font-bold text-white">He leído el tema</button>)}
              </li>
            ))}
          </ul>
        </section>
      )}

      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-600">Compartes tu progreso con</h3>
      {tutores === null && <Skeleton label="Cargando…" block={false} />}
      {tutores?.length === 0 && <p className="mb-4 text-sm text-slate-500">Ahora mismo no compartes tu progreso con nadie.</p>}
      <ul className="mb-6 space-y-2">
        {tutores?.map(t => (
          <li key={t.tutor_id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <div>
              <p className="font-semibold text-slate-900">{t.nombre}</p>
              <p className="text-xs text-slate-500">Desde el {new Date(t.desde).toLocaleDateString('es-ES')}</p>
            </div>
            <button type="button" disabled={ocupado} onClick={() => void dejar(t)} className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              Dejar de compartir
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={enviar} className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
        <label htmlFor="codigo-tutor" className="mb-2 block text-sm font-semibold text-slate-900">Código que te ha dado tu tutor</label>
        <div className="flex gap-2">
          <input
            id="codigo-tutor"
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            className="min-h-11 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-base uppercase tracking-widest"
            placeholder="Ej. ABCDE12345"
          />
          <button type="submit" disabled={ocupado || !codigo.trim()} className="min-h-11 rounded-lg bg-indigo-700 px-4 text-sm font-bold text-white disabled:opacity-50">Compartir</button>
        </div>
      </form>
    </div>
  );
}
