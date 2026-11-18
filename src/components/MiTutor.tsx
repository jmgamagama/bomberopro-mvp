import { useEffect, useState, type FormEvent } from 'react';
import { getMisTutores, revocarTutor, vincularTutor, type TutorVinculado } from '../lib/tutor';
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

  const cargar = async () => {
    try { setTutores(await getMisTutores()); } catch { setTutores([]); setAviso({ tipo: 'error', texto: 'No se pudo cargar tu lista de tutores.' }); }
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
        ¿Estudias con un profesor o academia? Introduce el código que te ha dado y podrá ver tu progreso para ayudarte mejor.
      </p>
      <details className="mb-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
        <summary className="cursor-pointer font-semibold text-slate-900">¿Qué ve mi tutor?</summary>
        <p className="mt-2">Tu correo, tus días de estudio, el tiempo estimado que respondes y tus aciertos, fallos y dudas por tema.</p>
        <p className="mt-1">No ve tu contraseña, datos de pago ni el contenido de tus respuestas. Puedes dejar de compartir cuando quieras.</p>
      </details>

      {aviso && (
        <p role="status" className={`mb-4 rounded-lg p-3 text-sm ${aviso.tipo === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>{aviso.texto}</p>
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
