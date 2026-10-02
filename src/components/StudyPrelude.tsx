import { useState } from 'react';
import { STUDY_PILOT, STUDY_PILOT_CONCEPTS } from '../data/studyPilot';

type Step = 'reading' | 'concepts' | 'recall' | 'comparison';
type SelfAssessment = 'complete' | 'partial' | 'retry';

interface StudyPreludeProps {
  preview: true;
  onStartQuestions: () => void;
  onNavigateHome: () => void;
}

export default function StudyPrelude({ preview, onStartQuestions, onNavigateHome }: StudyPreludeProps) {
  const [step, setStep] = useState<Step>('reading');
  const [recall, setRecall] = useState('');
  const [assessment, setAssessment] = useState<SelfAssessment | null>(null);
  const recalledPoints = recall.split(/\r?\n/).filter((line) => line.trim().length > 0);

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-8 text-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-indigo-700">Estudio guiado · demostración</p>
          <h1 className="mt-1 text-2xl font-bold">{STUDY_PILOT.title}</h1>
        </div>
        <button type="button" onClick={onNavigateHome} className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-slate-50">
          Salir al inicio
        </button>
      </div>

      <div role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
        Material piloto: {STUDY_PILOT.qaStatus.toLowerCase()}. Solo para demostración; no está aprobado para alumnos en producción.
      </div>

      <p className="text-sm text-slate-600">Versión de convocatoria: {STUDY_PILOT.convocatoriaVersion} · Paquete {STUDY_PILOT.id}</p>

      {step === 'reading' && (
        <section aria-labelledby="reading-title" className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Paso 1 de 4 · Lectura</p>
            <h2 id="reading-title" className="mt-1 text-xl font-bold">Lee el artículo completo</h2>
          </div>
          <div className="space-y-3 border-l-4 border-indigo-200 pl-4 leading-relaxed">
            {STUDY_PILOT.article.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <p className="text-sm text-slate-600">
            Fuente: <a className="font-semibold text-indigo-700 underline" href={STUDY_PILOT.sourceUrl} target="_blank" rel="noopener noreferrer">{STUDY_PILOT.sourceTitle} (BOE)</a>.
            {' '}Consultada el {STUDY_PILOT.sourceCheckedAt}; última actualización global del texto: {STUDY_PILOT.sourceGlobalUpdate}.
          </p>
          <button type="button" onClick={() => setStep('concepts')} className="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white hover:bg-indigo-800">
            Ver los 5 conceptos
          </button>
        </section>
      )}

      {step === 'concepts' && (
        <section aria-labelledby="concepts-title" className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Paso 2 de 4 · Conceptos</p>
            <h2 id="concepts-title" className="mt-1 text-xl font-bold">Cinco ideas para fijar</h2>
          </div>
          <ol className="list-decimal space-y-3 pl-6">
            {STUDY_PILOT_CONCEPTS.map((concept) => (
              <li key={concept.id}><span className="font-medium">{concept.text}</span> <span className="text-sm text-slate-600">(art. {concept.article})</span></li>
            ))}
          </ol>
          <p className="text-sm text-slate-600">En el siguiente paso se ocultarán el artículo y las ideas. Recuerda tres puntos sin mirar.</p>
          <button type="button" onClick={() => setStep('recall')} className="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white hover:bg-indigo-800">
            Recordar sin pistas
          </button>
        </section>
      )}

      {step === 'recall' && (
        <section aria-labelledby="recall-title" className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Paso 3 de 4 · Recuperación activa</p>
            <h2 id="recall-title" className="mt-1 text-xl font-bold">Recuerda tres puntos del artículo 1</h2>
          </div>
          <label htmlFor="recall-points" className="block text-sm font-medium">Escribe un punto por línea. El texto seguirá oculto hasta que escribas tres.</label>
          <textarea id="recall-points" value={recall} onChange={(event) => setRecall(event.target.value)} rows={6} className="w-full rounded-lg border border-slate-300 p-3" placeholder={'1.\n2.\n3.'} />
          <p className="text-sm text-slate-600">{Math.min(recalledPoints.length, 3)} de 3 puntos escritos. Tus notas permanecen solo en esta pantalla.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={recalledPoints.length < 3} onClick={() => setStep('comparison')} className="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50">
              Revelar texto y comparar
            </button>
            <button type="button" onClick={() => setStep('comparison')} className="rounded-lg border px-4 py-2 font-semibold hover:bg-slate-50">
              No lo recuerdo
            </button>
          </div>
        </section>
      )}

      {step === 'comparison' && (
        <section aria-labelledby="comparison-title" className="space-y-5 rounded-2xl border bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Paso 4 de 4 · Comparación</p>
            <h2 id="comparison-title" className="mt-1 text-xl font-bold">Compara lo que recordaste</h2>
          </div>
          <div>
            <h3 className="font-semibold">Tus tres puntos</h3>
            <p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-3">{recall || 'No escribiste puntos esta vez.'}</p>
          </div>
          <div>
            <h3 className="font-semibold">Texto del artículo 1</h3>
            <div className="mt-2 space-y-2 rounded-lg bg-indigo-50 p-3">{STUDY_PILOT.article.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </div>
          <fieldset className="space-y-2">
            <legend className="font-semibold">Autoevaluación para esta demostración</legend>
            {([
              ['complete', 'Recordé los tres puntos'],
              ['partial', 'Recordé algunos puntos'],
              ['retry', 'Necesito volver a leer'],
            ] as const).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2"><input type="radio" name="study-self-assessment" checked={assessment === value} onChange={() => setAssessment(value)} />{label}</label>
            ))}
          </fieldset>
          <p className="text-sm text-slate-600">Esta autoevaluación no cuenta como intento ni modifica tu dominio.</p>
          {assessment === 'retry' ? (
            <button type="button" onClick={() => { setRecall(''); setAssessment(null); setStep('reading'); }} className="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white hover:bg-indigo-800">
              Volver a leer
            </button>
          ) : (
            <button type="button" disabled={!assessment} onClick={onStartQuestions} className="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50">
              Comenzar preguntas
            </button>
          )}
        </section>
      )}
      {preview && <p className="text-xs text-slate-500">Vista previa local · contenido pendiente de validación editorial</p>}
    </section>
  );
}
