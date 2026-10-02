import { useEffect, useState } from 'react';
import { SAVE_FAILED_EVENT, type SaveFailureReason } from '../lib/saveAttemptToServer';

const MESSAGES: Record<SaveFailureReason, string> = {
  session:
    'Tu sesión ha caducado y tu última respuesta no se ha guardado. Recarga la página e inicia sesión de nuevo para no perder tu progreso.',
  error:
    'No hemos podido guardar tu última respuesta (posible fallo de conexión). Comprueba tu conexión; si sigue pasando, recarga la página.',
};

/** Aviso visible y persistente cuando una respuesta no llega al servidor. */
export default function SaveFailureBanner() {
  const [reason, setReason] = useState<SaveFailureReason | null>(null);

  useEffect(() => {
    const onFail = (e: Event) => {
      const detail = (e as CustomEvent<{ reason?: SaveFailureReason }>).detail;
      setReason(detail?.reason === 'session' ? 'session' : 'error');
    };
    window.addEventListener(SAVE_FAILED_EVENT, onFail);
    return () => window.removeEventListener(SAVE_FAILED_EVENT, onFail);
  }, []);

  if (!reason) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="sticky top-0 z-[60] flex items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900"
      id="mira-save-failure-banner"
    >
      <span>{MESSAGES[reason]}</span>
      <span className="flex shrink-0 gap-2">
        {reason === 'session' && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-md bg-amber-600 px-3 py-1 text-xs font-bold text-white hover:bg-amber-700"
          >
            Recargar
          </button>
        )}
        <button
          type="button"
          onClick={() => setReason(null)}
          className="rounded-md border border-amber-300 px-3 py-1 text-xs font-bold hover:bg-amber-100"
        >
          Entendido
        </button>
      </span>
    </div>
  );
}
