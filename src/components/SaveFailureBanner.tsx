import { useEffect, useState } from 'react';
import {
  SAVE_FAILED_EVENT,
  SAVE_STATE_EVENT,
  flushPendingAttempts,
  type SaveFailureReason,
} from '../lib/saveAttemptToServer';
import { countAllPending } from '../lib/attemptOutbox';

const MESSAGES: Record<SaveFailureReason, string> = {
  session:
    'Tu sesión ha caducado y tu última respuesta no se ha guardado en tu cuenta. Inicia sesión de nuevo con la misma cuenta: las respuestas pendientes se conservan en este dispositivo y se enviarán solas.',
  error:
    'No hemos podido guardar tu última respuesta (posible fallo de conexión). Sigue pendiente en este dispositivo: pulsa Reintentar o comprueba tu conexión; se enviará sola al recuperarla.',
  rejected:
    'El servidor ha rechazado una de tus respuestas y no se guardará en tu cuenta. Si te vuelve a pasar, avísanos con la pregunta y la hora.',
};

interface Props {
  /** Al montarse, avisa si hay respuestas pendientes de un uso anterior (pantalla de acceso tras caducar la sesión). */
  showIfPending?: boolean;
}

/** Aviso visible y persistente cuando una respuesta no ha quedado confirmada en el servidor. */
export default function SaveFailureBanner({ showIfPending = false }: Props) {
  // `rejected` es una pérdida definitiva: solo la retira el usuario. session/error se retiran
  // cuando el servidor confirma que ya no queda NADA pendiente (de ninguna cuenta).
  const [transient, setTransient] = useState<'session' | 'error' | null>(null);
  const [rejected, setRejected] = useState(false);
  const [pending, setPending] = useState(0);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (showIfPending) {
      const n = countAllPending();
      if (n > 0) {
        setTransient('session');
        setPending(n);
      }
    }
    const onFail = (e: Event) => {
      const detail = (e as CustomEvent<{ reason?: SaveFailureReason; pending?: number }>).detail;
      if (detail?.reason === 'rejected') setRejected(true);
      else setTransient(detail?.reason === 'session' ? 'session' : 'error');
      setPending(typeof detail?.pending === 'number' ? detail.pending : 0);
    };
    const onState = (e: Event) => {
      const detail = (e as CustomEvent<{ state?: string; pending?: number }>).detail;
      if (detail?.state === 'saved' && (detail.pending ?? 0) === 0) {
        setTransient(null);
        setPending(0);
      }
    };
    window.addEventListener(SAVE_FAILED_EVENT, onFail);
    window.addEventListener(SAVE_STATE_EVENT, onState);
    return () => {
      window.removeEventListener(SAVE_FAILED_EVENT, onFail);
      window.removeEventListener(SAVE_STATE_EVENT, onState);
    };
  }, [showIfPending]);

  const reason: SaveFailureReason | null = transient ?? (rejected ? 'rejected' : null);
  if (!reason) return null;

  const retry = async () => {
    setRetrying(true);
    try {
      await flushPendingAttempts();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="sticky top-0 z-[60] flex items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900"
      id="mira-save-failure-banner"
    >
      <span>
        {MESSAGES[reason]}
        {transient && rejected && ` ${MESSAGES.rejected}`}
        {pending > 0 && (
          <strong className="ml-1">
            {pending === 1 ? '1 respuesta pendiente.' : `${pending} respuestas pendientes.`}
          </strong>
        )}
      </span>
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
        {reason === 'error' && (
          <button
            type="button"
            onClick={retry}
            disabled={retrying}
            className="rounded-md bg-amber-600 px-3 py-1 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {retrying ? 'Reintentando…' : 'Reintentar'}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setTransient(null);
            setRejected(false);
          }}
          className="rounded-md border border-amber-300 px-3 py-1 text-xs font-bold hover:bg-amber-100"
        >
          Entendido
        </button>
      </span>
    </div>
  );
}
