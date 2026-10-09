import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import {
  ALL_TOPICS,
  STATE_LABELS,
  flushConceptEvents,
  isCorrectOption,
  loadConceptProgress,
  loadConceptSession,
  recordConceptEvent,
  rejectedConceptEvents,
  type Confidence,
  type ConceptProgress,
  type ConceptSessionItem,
  type SelfGrade,
  type VisibleState,
} from '../lib/conceptEngine';
import { newAttemptKey } from '../lib/saveAttemptToServer';
import { shuffleArray } from '../utils/shuffleOptions';
import ReportQuestionButton from './ReportQuestionButton';

interface Props {
  userId: string;
  onExit: () => void;
}

const MINUTES = [10, 20, 45, 60];
const ORDER: VisibleState[] = ['consolidado', 'dominado', 'aprendiendo', 'debil', 'por_aprender'];

/** Barra de progreso del tema por estado de los conceptos (capa 2: progreso). */
function ProgressBar({ p }: { p: ConceptProgress }) {
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
        {ORDER.map(s => (p[s] > 0 ? (
          <div key={s} className={STATE_LABELS[s].color} style={{ width: `${(p[s] / p.total) * 100}%` }} />
        ) : null))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
        {ORDER.map(s => (
          <li key={s} className="flex items-center gap-1.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${STATE_LABELS[s].color}`} aria-hidden="true" />
            {STATE_LABELS[s].label}: <strong className="text-slate-800">{p[s]}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ConceptStudy({ userId, onExit }: Props) {
  const [phase, setPhase] = useState<'inicio' | 'cargando' | 'sesion' | 'fin'>('inicio');
  const [minutes, setMinutes] = useState(20);
  const [progress, setProgress] = useState<ConceptProgress | null>(null);
  const [items, setItems] = useState<ConceptSessionItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pendingSave, setPendingSave] = useState(0);
  const [rejectedSave, setRejectedSave] = useState(0);
  const [volatileSaveFailure, setVolatileSaveFailure] = useState(false);
  const [stats, setStats] = useState({ tests: 0, aciertos: 0, nuevos: 0 });
  const sessionId = useRef<string>(newAttemptKey());

  // Por ítem
  const [revealed, setRevealed] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [answered, setAnswered] = useState(false);
  const shownAt = useRef(Date.now());

  const refreshProgress = async () => {
    try { setProgress(await loadConceptProgress(ALL_TOPICS)); } catch { /* se muestra sin progreso */ }
  };

  useEffect(() => {
    let active = true;
    const retry = async () => {
      const pending = await flushConceptEvents(userId);
      if (!active) return;
      setPendingSave(pending);
      setRejectedSave(rejectedConceptEvents(userId));
    };
    void retry();
    void refreshProgress();
    window.addEventListener('online', retry);
    const timer = window.setInterval(() => { void retry(); }, 30_000);
    return () => { active = false; window.clearInterval(timer); window.removeEventListener('online', retry); };
  }, [userId]);

  const item = items[idx];
  const options = useMemo(() => (item?.options ? shuffleArray(item.options) : []), [item?.pos, items]);

  const resetItem = () => {
    setRevealed(false); setChosen(null); setConfidence(null); setAnswered(false); shownAt.current = Date.now();
  };

  const start = async () => {
    setPhase('cargando'); setError(null);
    try {
      const data = await loadConceptSession(ALL_TOPICS, minutes);
      if (data.length === 0) {
        setError('Hoy no tienes nada pendiente en este tema. Vuelve mañana.');
        setPhase('inicio');
        return;
      }
      sessionId.current = newAttemptKey();
      setItems(data); setIdx(0); setStats({ tests: 0, aciertos: 0, nuevos: 0 }); resetItem();
      setPhase('sesion');
    } catch {
      setError('No se ha podido preparar la sesión. Comprueba la conexión e inténtalo de nuevo.');
      setPhase('inicio');
    }
  };

  const save = async (ev: Parameters<typeof recordConceptEvent>[1]) => {
    const r = await recordConceptEvent(userId, { ...ev, p_session_id: sessionId.current, p_response_ms: Date.now() - shownAt.current });
    setPendingSave(r.pending);
    setRejectedSave(r.rejected);
    if (r.storageUnavailable && !r.saved) setVolatileSaveFailure(true);
    if (r.saved) void refreshProgress();
  };

  const next = () => {
    if (idx + 1 >= items.length) {
      setPhase('fin');
      void refreshProgress();
      return;
    }
    setIdx(i => i + 1);
    resetItem();
  };

  const onFicha = async () => {
    setStats(s => ({ ...s, nuevos: s.nuevos + 1 }));
    void save({ p_concept_id: item.concept_id, p_kind: 'ficha' });
    next();
  };

  const onRecall = async (g: SelfGrade) => {
    void save({ p_concept_id: item.concept_id, p_kind: 'recuerdo', p_self_grade: g });
    next();
  };

  const onConfirmTest = async () => {
    if (!chosen || !confidence) return;
    const ok = isCorrectOption(item, chosen);
    setAnswered(true);
    setStats(s => ({ ...s, tests: s.tests + 1, aciertos: s.aciertos + (ok ? 1 : 0) }));
    void save({ p_concept_id: item.concept_id, p_kind: 'test', p_question_id: item.question_id, p_correct: ok, p_confidence: confidence });
  };

  const header = (
    <div className="mb-4 flex items-center justify-between">
      <button type="button" onClick={onExit} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver al inicio
      </button>
      {phase === 'sesion' && <span className="text-sm text-slate-500">{idx + 1} de {items.length}</span>}
    </div>
  );

  const saveNote = (
    <>
      {volatileSaveFailure && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-900">
        No se pudo guardar una respuesta ni conservarla en este dispositivo. Comprueba el almacenamiento y la conexión antes de seguir.
      </p>}
      {rejectedSave > 0 && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-900">
        {rejectedSave} respuestas no se pudieron registrar. Se conservan en este dispositivo para revisión.
      </p>}
      {pendingSave > rejectedSave && !volatileSaveFailure && <p role="status" className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
        {pendingSave - rejectedSave} respuestas pendientes de confirmar. Se reintentará el envío al recuperar la conexión.
      </p>}
    </>
  );

  if (phase === 'inicio' || phase === 'cargando') {
    return (
      <div className="mx-auto max-w-2xl">
        {header}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Estudiar hoy · Temas 35, 39 y 40</p>
          <h1 className="mt-1 text-xl font-bold text-slate-900">Procedimientos de trabajo CPEI: conducción y amianto</h1>
          <p className="mt-2 text-sm text-slate-600">
            Estudias conceptos, no preguntas sueltas. BomberoPro decide qué toca hoy: primero lo que estás a punto de olvidar, después conceptos nuevos.
          </p>
          {progress && <div className="mt-5"><ProgressBar p={progress} /></div>}
          <fieldset className="mt-6">
            <legend className="text-sm font-semibold text-slate-800">¿Cuánto tiempo tienes?</legend>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {MINUTES.map(m => (
                <button key={m} type="button" aria-pressed={minutes === m} onClick={() => setMinutes(m)}
                  className={`rounded-xl border py-2 text-sm font-semibold ${minutes === m ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>
                  {m} min
                </button>
              ))}
            </div>
          </fieldset>
          {error && <p role="alert" className="mt-4 text-sm font-semibold text-red-700">{error}</p>}
          <button type="button" onClick={start} disabled={phase === 'cargando'}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-base font-bold text-white hover:bg-indigo-700 disabled:opacity-60">
            {phase === 'cargando' ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Preparando…</> : 'Empezar'}
          </button>
          {saveNote}
        </div>
      </div>
    );
  }

  if (phase === 'fin') {
    return (
      <div className="mx-auto max-w-2xl">
        {header}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Sesión terminada</h1>
          <p className="mt-2 text-sm text-slate-600">
            {stats.nuevos} conceptos nuevos · {stats.aciertos} de {stats.tests} preguntas bien.
          </p>
          <p className="mt-1 text-sm text-slate-600">Lo que has fallado volverá pronto; lo que sabes, más adelante.</p>
          {progress && <div className="mt-5 text-left"><ProgressBar p={progress} /></div>}
          <div className="mt-6 flex gap-2">
            <button type="button" onClick={() => setPhase('inicio')} className="flex-1 rounded-xl bg-indigo-600 py-3 font-bold text-white">Otra sesión</button>
            <button type="button" onClick={onExit} className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-700">Volver al inicio</button>
          </div>
          {saveNote}
        </div>
      </div>
    );
  }

  const source = (
    <p className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
      <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>Fuente: {item.fuente}{item.pagina ? `, página ${item.pagina}` : ''}</span>
    </p>
  );

  return (
    <div className="mx-auto max-w-2xl">
      {header}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" data-formato={item.formato} data-concept={item.concept_id}>
        {item.formato === 'ficha' && (
          <>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Concepto nuevo</p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">{item.concept_pregunta}</h2>
            <p className="mt-3 text-base text-slate-800">{item.concept_respuesta}</p>
            {source}
            <button type="button" onClick={onFicha} className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white">Entendido</button>
          </>
        )}

        {item.formato === 'recuerdo' && (
          <>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Recuerda sin mirar</p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">{item.concept_pregunta}</h2>
            {!revealed ? (
              <button type="button" onClick={() => setRevealed(true)} className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white">
                Mostrar respuesta
              </button>
            ) : (
              <>
                <p className="mt-3 text-base text-slate-800">{item.concept_respuesta}</p>
                {source}
                <p className="mt-5 text-sm font-semibold text-slate-700">¿Lo sabías?</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => onRecall('no')} className="rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-700">No lo sabía</button>
                  <button type="button" onClick={() => onRecall('dude')} className="rounded-xl border border-amber-200 bg-amber-50 py-2.5 text-sm font-semibold text-amber-800">Dudé</button>
                  <button type="button" onClick={() => onRecall('si')} className="rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-800">Lo sabía</button>
                </div>
              </>
            )}
          </>
        )}

        {item.formato === 'test' && (
          <>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              {item.motivo === 'ERROR_RECIENTE' ? 'Lo fallaste hace poco' : item.motivo === 'REPASO_VENCIDO' ? 'Repaso' : 'Comprueba lo aprendido'}
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">{item.question}</h2>
            <div className="mt-2 flex justify-end"><ReportQuestionButton questionId={item.question_id} onReported={next} /></div>
            <div className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label="Opciones">
              {options.map(opt => {
                const isSel = chosen === opt;
                const isOk = opt === item.correct_answer;
                let cls = 'border-slate-200 bg-white';
                if (answered && isOk) cls = 'border-emerald-500 bg-emerald-50';
                else if (answered && isSel) cls = 'border-red-500 bg-red-50';
                else if (isSel) cls = 'border-indigo-600 bg-indigo-50';
                return (
                  <button key={opt} type="button" role="radio" aria-checked={isSel} disabled={answered}
                    onClick={() => setChosen(opt)} className={`rounded-xl border p-3 text-left text-sm ${cls}`}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {!answered && chosen && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-700">¿Cómo de seguro estás?</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {([['alta', 'Lo sé'], ['media', 'Creo que sí'], ['baja', 'Me la juego']] as const).map(([v, l]) => (
                    <button key={v} type="button" aria-pressed={confidence === v} onClick={() => setConfidence(v)}
                      className={`rounded-xl border py-2 text-sm font-semibold ${confidence === v ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {answered && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-800">
                <p className="flex items-center gap-2 font-bold">
                  {chosen && isCorrectOption(item, chosen)
                    ? <><CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" /> Correcto</>
                    : <><XCircle className="h-5 w-5 text-red-600" aria-hidden="true" /> No es correcto</>}
                </p>
                <p className="mt-2"><strong>Concepto:</strong> {item.concept_respuesta}</p>
                {item.explanation && <p className="mt-2 text-slate-600">{item.explanation}</p>}
                {source}
              </div>
            )}
            {!answered ? (
              <button type="button" onClick={onConfirmTest} disabled={!chosen || !confidence}
                className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white disabled:opacity-50">
                Confirmar respuesta
              </button>
            ) : (
              <button type="button" onClick={next} className="mt-6 w-full rounded-xl bg-slate-900 py-3 font-bold text-white">Siguiente</button>
            )}
          </>
        )}
        {saveNote}
      </div>
    </div>
  );
}
