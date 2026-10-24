import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import {
  ALL_TOPICS,
  STATE_LABELS,
  flushConceptEvents,
  pendingConceptEvents,
  calibrationMessage,
  isConceptAnswerFeedback,
  loadCalibration,
  loadConceptProgress,
  loadStepQuestion,
  loadConceptSession,
  recordConceptEvent,
  rejectedConceptEvents,
  supportsCrossTabCoordination,
  type Confidence,
  type ConceptProgress,
  type ConceptSessionItem,
  type SelfGrade,
  type VisibleState,
} from '../lib/conceptEngine';
import { newAttemptKey } from '../lib/saveAttemptToServer';
import { shuffleQuestionOptions } from '../utils/shuffleOptions';
import ReportQuestionButton from './ReportQuestionButton';
import { startStudySession, finishStudySession } from '../lib/studySession';
import SessionCelebration from './SessionCelebration';
import { useStudyStreak } from '../lib/streak';

interface Props {
  userId: string;
  onExit: () => void;
  /** Tema concreto (id de topics) o ALL_TOPICS para la sesión mezclada. */
  topicId?: number | null;
  /** Textos de la cabecera de inicio. */
  etiqueta?: string;
  titulo?: string;
}

/** Tras un fallo, la pregunta más fácil del mismo concepto se intercala a esta distancia (no justo después). */
const ESCALERA_SEPARACION = 2;
const ESCALERA_TIMEOUT_MS = 8_000;

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

export default function ConceptStudy({ userId, onExit, topicId = ALL_TOPICS, etiqueta = 'Estudiar hoy · Todos tus temas preparados', titulo = 'Tu sesión de hoy' }: Props) {
  const [phase, setPhase] = useState<'inicio' | 'cargando' | 'sesion' | 'fin'>('inicio');
  // Racha de la cuenta: se lee al terminar la sesión (migración 24).
  const streak = useStudyStreak(phase === 'fin');
  const [minutes, setMinutes] = useState(20);
  const [progress, setProgress] = useState<ConceptProgress | null>(null);
  const [items, setItems] = useState<ConceptSessionItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [staging, setStaging] = useState(false);
  const ownerRef = useRef(userId);
  ownerRef.current = userId;
  const [pendingSave, setPendingSave] = useState(0);
  const [rejectedSave, setRejectedSave] = useState(0);
  const [volatileSaveFailure, setVolatileSaveFailure] = useState(false);
  const [stats, setStats] = useState({ tests: 0, aciertos: 0, nuevos: 0 });
  const [calibracion, setCalibracion] = useState<string | null>(null);
  const sessionId = useRef<string>(newAttemptKey());
  const sessionFinished = useRef(false);
  const sessionEpoch = useRef(0);
  const [recoveryPending, setRecoveryPending] = useState(false);
  const [recoveryNote, setRecoveryNote] = useState<string | null>(null);

  // Por ítem
  const [revealed, setRevealed] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [answered, setAnswered] = useState(false);
  const [testFeedback, setTestFeedback] = useState<{
    correct: boolean; correct_answer: string; explanation: string | null; concept_respuesta: string | null;
  } | null>(null);
  const [pendingTestChoice, setPendingTestChoice] = useState<string | null>(null);
  const testEventId = useRef(newAttemptKey());
  const testResponseMs = useRef<number | null>(null);
  const testConfidence = useRef<Confidence | null>(null);
  const shownAt = useRef(Date.now());

  const refreshProgress = async () => {
    const owner = userId;
    try { const data = await loadConceptProgress(topicId, userId); if (ownerRef.current === owner) setProgress(data); } catch { /* se muestra sin progreso */ }
  };

  useEffect(() => {
    let active = true;
    sessionEpoch.current += 1;
    setRecoveryPending(false); setRecoveryNote(null);
    setPhase('inicio'); setItems([]); setProgress(null); setStaging(false);
    setStats({ tests: 0, aciertos: 0, nuevos: 0 });
    const retry = async () => {
      const pending = await flushConceptEvents(userId);
      if (!active) return;
      setPendingSave(pending);
      setRejectedSave(rejectedConceptEvents(userId));
    };
    void retry();
    void refreshProgress();
    const changed = (event: StorageEvent) => {
      if (!active || !event.key?.startsWith('bomberopro:concept-events:v1')) return;
      const pending = pendingConceptEvents(userId);
      setPendingSave(pending);
      setRejectedSave(rejectedConceptEvents(userId));
      if (pending === 0) void refreshProgress();
    };
    window.addEventListener('storage', changed);
    window.addEventListener('online', retry);
    const timer = window.setInterval(() => { void retry(); }, 30_000);
    return () => { active = false; sessionEpoch.current += 1; window.clearInterval(timer); window.removeEventListener('online', retry); window.removeEventListener('storage', changed); };
  }, [userId, topicId]);

  const item = items[idx];
  // Solo se baraja al cambiar de elemento: intercalar uno nuevo (escalera) no debe reordenar las opciones visibles.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = useMemo(() => (item?.options ? shuffleQuestionOptions({ options: item.options }).options : []), [item?.pos, item?.question_id]);

  const resetItem = () => {
    setRevealed(false); setChosen(null); setConfidence(null); setAnswered(false);
    setRecoveryNote(null);
    setTestFeedback(null); setPendingTestChoice(null); testEventId.current = newAttemptKey();
    testResponseMs.current = null; testConfidence.current = null;
    shownAt.current = Date.now();
  };

  const start = async () => {
    setPhase('cargando'); setError(null);
    try {
      const data = await loadConceptSession(topicId, minutes, userId);
      if (ownerRef.current !== userId) return;
      if (data.length === 0) {
        setError('Hoy no tienes nada pendiente en este tema. Vuelve mañana.');
        setPhase('inicio');
        return;
      }
      sessionEpoch.current += 1;
      sessionId.current = newAttemptKey();
      sessionFinished.current = false;
      // Registro de la sesión para medir cuántas se terminan (mejor esfuerzo, nunca bloquea).
      void startStudySession(sessionId.current, 'conceptos', topicId == null ? null : [topicId], data.length);
      setItems(data); setIdx(0); setStats({ tests: 0, aciertos: 0, nuevos: 0 }); resetItem();
      setPhase('sesion');
    } catch {
      if (ownerRef.current !== userId) return;
      setError('No se ha podido preparar la sesión. Comprueba la conexión e inténtalo de nuevo.');
      setPhase('inicio');
    }
  };

  const save = async (ev: Parameters<typeof recordConceptEvent>[1]): Promise<boolean> => {
    const owner = userId;
    setStaging(true);
    try {
      const r = await recordConceptEvent(owner, { ...ev, p_session_id: sessionId.current, p_response_ms: Date.now() - shownAt.current });
      if (ownerRef.current !== owner) return false;
      setPendingSave(r.pending);
      setRejectedSave(r.rejected);
      if (r.storageUnavailable && !r.saved) setVolatileSaveFailure(true);
      if (r.saved) void refreshProgress();
      return r.saved || (!r.storageUnavailable && r.pending > 0);
    } finally {
      if (ownerRef.current === owner) setStaging(false);
    }
  };

  const next = () => {
    if (recoveryPending || staging) return;
    if (idx + 1 >= items.length) {
      setPhase('fin');
      if (!sessionFinished.current) { sessionFinished.current = true; void finishStudySession(sessionId.current, 'conceptos'); }
      void refreshProgress();
      const owner = userId;
      void loadCalibration(topicId, userId).then(c => { if (ownerRef.current === owner) setCalibracion(calibrationMessage(c)); });
      return;
    }
    setIdx(i => i + 1);
    resetItem();
  };

  const onFicha = async () => {
    if (staging) return;
    if (await save({ p_concept_id: item.concept_id, p_kind: 'ficha' })) {
      setStats(s => ({ ...s, nuevos: s.nuevos + 1 })); next();
    }
  };

  const onRecall = async (g: SelfGrade) => {
    if (staging) return;
    if (await save({ p_concept_id: item.concept_id, p_kind: 'recuerdo', p_self_grade: g })) next();
  };

  const onConfirmTest = async () => {
    if (!chosen || !confidence || staging || item.question_id == null) return;
    const owner = userId;
    const epoch = sessionEpoch.current;
    const selectedOption = pendingTestChoice ?? chosen;
    if (testResponseMs.current == null) testResponseMs.current = Date.now() - shownAt.current;
    if (testConfidence.current == null) testConfidence.current = confidence;
    // El mismo ID, opción, confianza y duración en todos los reintentos: el servidor califica UNA vez.
    setPendingTestChoice(selectedOption);
    setStaging(true);
    try {
      const r = await recordConceptEvent(owner, {
        p_client_event_id: testEventId.current,
        p_concept_id: item.concept_id,
        p_kind: 'test',
        p_question_id: item.question_id,
        p_selected_option: selectedOption,
        p_confidence: testConfidence.current,
        p_session_id: sessionId.current,
        p_response_ms: testResponseMs.current,
      });
      if (ownerRef.current !== owner || sessionEpoch.current !== epoch) return;
      setPendingSave(r.pending);
      setRejectedSave(r.rejected);
      if (r.storageUnavailable && !r.saved) setVolatileSaveFailure(true);
      if (r.saved && isConceptAnswerFeedback(r.data)) {
        setTestFeedback(r.data);
        setAnswered(true);
        setStats(s => ({ ...s, tests: s.tests + 1, aciertos: s.aciertos + (r.data.correct ? 1 : 0) }));
        void refreshProgress();
        // La recuperación debe resolverse antes de poder finalizar la sesión.
        if (!r.data.correct) await intercalarEscalera(item, epoch);
      }
      // Una respuesta sin confirmación/feedback no se presenta como corregida.
      // Permanece fija para reintentar con la misma clave cuando regrese la red.
    } finally {
      if (ownerRef.current === owner && sessionEpoch.current === epoch) setStaging(false);
    }
  };

  /** Otra pregunta del concepto, si existe; el servidor puede devolver igual dificultad. */
  const intercalarEscalera = async (fallado: ConceptSessionItem, epoch: number) => {
    const owner = userId;
    setRecoveryPending(true);
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const step = await Promise.race([
        loadStepQuestion(fallado.concept_id, fallado.question_id, userId),
        new Promise<null>(resolve => { timer = setTimeout(() => resolve(null), ESCALERA_TIMEOUT_MS); }),
      ]);
      if (ownerRef.current !== owner || sessionEpoch.current !== epoch) return;
      if (!step) {
        setRecoveryNote('No se ha podido añadir otra pregunta de este concepto. Puedes continuar; tu respuesta ya está guardada.');
        return;
      }
      setItems(prev => {
        const failedAt = prev.findIndex(x => x.pos === fallado.pos);
        if (failedAt < 0 || prev.some(x => x.question_id === step.question_id && x.motivo === 'ESCALERA')) return prev;
        const at = Math.min(failedAt + 1 + ESCALERA_SEPARACION, prev.length);
        const extra: ConceptSessionItem = {
          ...fallado,
          pos: Math.max(...prev.map(x => x.pos)) + 1,
          motivo: 'ESCALERA',
          question_id: step.question_id,
          question: step.question,
          options: step.options,
          explanation: null,
          concept_respuesta: null,
        };
        return [...prev.slice(0, at), extra, ...prev.slice(at)];
      });
    } catch {
      if (ownerRef.current === owner && sessionEpoch.current === epoch) {
        setRecoveryNote('No se ha podido añadir otra pregunta de este concepto. Puedes continuar; tu respuesta ya está guardada.');
      }
    } finally {
      if (timer) clearTimeout(timer);
      if (ownerRef.current === owner && sessionEpoch.current === epoch) setRecoveryPending(false);
    }
  };

  const exit = () => { sessionEpoch.current += 1; onExit(); };

  const header = (
    <div className="mb-4 flex items-center justify-between">
      <button type="button" onClick={exit} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver al inicio
      </button>
      {phase === 'sesion' && <span className="text-sm text-slate-500">{idx + 1} de {items.length}</span>}
    </div>
  );

  const saveNote = (
    <>
      {staging && <p role="status" className="mt-3 text-sm text-slate-600">{recoveryPending ? 'Preparando otra pregunta…' : 'Guardando respuesta…'}</p>}
      {recoveryNote && <p role="status" className="mt-3 text-sm text-slate-600">{recoveryNote}</p>}
      {!supportsCrossTabCoordination() && <p role="status" className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Usa una sola pestaña de estudio en este navegador para mantener tus respuestas sincronizadas.
      </p>}
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
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{etiqueta}</p>
          <h1 className="mt-1 text-xl font-bold text-slate-900">{titulo}</h1>
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
        <SessionCelebration
          titulo="¡Sesión terminada!"
          mensaje={`${stats.tests > 0 && stats.aciertos / stats.tests >= 0.8 ? '¡Gran trabajo! ' : ''}Lo que has fallado volverá pronto; lo que sabes, más adelante.`}
          stats={[
            { label: 'Nuevos', value: String(stats.nuevos), tone: 'indigo' },
            { label: 'Aciertos', value: `${stats.aciertos}/${stats.tests}`, tone: 'emerald' },
            { label: 'Acierto', value: stats.tests > 0 ? `${Math.round((stats.aciertos / stats.tests) * 100)}%` : '—', tone: 'amber' },
          ]}
          streak={streak}
          primary={{ label: 'Otra sesión', onClick: () => setPhase('inicio') }}
          secondary={{ label: 'Volver al inicio', onClick: exit }}
        >
          <p className="sr-only">{stats.nuevos} conceptos nuevos · {stats.aciertos} de {stats.tests} preguntas bien.</p>
          {calibracion && <p className="rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-900" data-testid="calibracion">{calibracion}</p>}
          {progress && <div className="text-left"><ProgressBar p={progress} /></div>}
          {saveNote}
        </SessionCelebration>
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
            <button type="button" onClick={onFicha} disabled={staging} className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white">Entendido</button>
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
                  <button type="button" disabled={staging} onClick={() => onRecall('no')} className="rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-700">No lo sabía</button>
                  <button type="button" disabled={staging} onClick={() => onRecall('dude')} className="rounded-xl border border-amber-200 bg-amber-50 py-2.5 text-sm font-semibold text-amber-800">Dudé</button>
                  <button type="button" disabled={staging} onClick={() => onRecall('si')} className="rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-800">Lo sabía</button>
                </div>
              </>
            )}
          </>
        )}

        {item.formato === 'test' && (
          <>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              {item.motivo === 'ESCALERA' ? 'Vuelve a practicar este concepto'
                : item.motivo === 'VERIFICAR' ? 'Dijiste que lo sabías: compruébalo'
                : item.motivo === 'ERROR_RECIENTE' ? 'Lo fallaste hace poco'
                : item.motivo === 'REPASO_VENCIDO' ? 'Repaso' : 'Comprueba lo aprendido'}
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">{item.question}</h2>
            <div className="mt-2 flex justify-end"><ReportQuestionButton questionId={item.question_id} onReported={next} /></div>
            <div className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label="Opciones">
              {options.map(opt => {
                const isSel = chosen === opt;
                const isOk = answered && opt === testFeedback?.correct_answer;
                let cls = 'border-slate-200 bg-white';
                if (answered && isOk) cls = 'border-emerald-500 bg-emerald-50';
                else if (answered && isSel) cls = 'border-red-500 bg-red-50';
                else if (isSel) cls = 'border-indigo-600 bg-indigo-50';
                return (
                  <button key={opt} type="button" role="radio" aria-checked={isSel} disabled={answered || !!pendingTestChoice}
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
                    <button key={v} type="button" aria-pressed={confidence === v} disabled={!!pendingTestChoice} onClick={() => setConfidence(v)}
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
                  {testFeedback?.correct
                    ? <><CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" /> Correcto</>
                    : <><XCircle className="h-5 w-5 text-red-600" aria-hidden="true" /> No es correcto</>}
                </p>
                <p className="mt-2"><strong>Concepto:</strong> {testFeedback?.concept_respuesta}</p>
                {testFeedback?.explanation && <p className="mt-2 text-slate-600">{testFeedback.explanation}</p>}
                {source}
              </div>
            )}
            {!answered ? (
              <>
                {pendingTestChoice && <p role="status" className="mt-3 text-sm text-amber-800">
                  Respuesta pendiente de confirmación. Reintenta cuando tengas conexión; no se cambiará tu elección.
                </p>}
                <button type="button" onClick={onConfirmTest} disabled={!chosen || !confidence || staging}
                  className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white disabled:opacity-50">
                  {pendingTestChoice ? 'Reintentar comprobación' : 'Confirmar respuesta'}
                </button>
              </>
            ) : (
              <button type="button" onClick={next} disabled={staging} className="mt-6 w-full rounded-xl bg-slate-900 py-3 font-bold text-white">Siguiente</button>
            )}
          </>
        )}
        {saveNote}
      </div>
    </div>
  );
}
