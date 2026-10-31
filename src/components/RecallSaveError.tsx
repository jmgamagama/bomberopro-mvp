interface RecallSaveErrorProps {
  onRetry: () => void;
}

/** Aviso cuando no se pudo guardar la autoevaluación en el dispositivo; la ficha se queda para reintentar. */
export default function RecallSaveErrorNotice({ onRetry }: RecallSaveErrorProps) {
  return (
    <div role="alert" id="recall-save-error" className="space-y-2 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900">
      <p>
        No se ha podido guardar tu respuesta en este dispositivo (almacenamiento lleno o bloqueado). La ficha sigue aquí:
        no has perdido nada.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="min-h-11 rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
      >
        Reintentar guardado
      </button>
    </div>
  );
}
