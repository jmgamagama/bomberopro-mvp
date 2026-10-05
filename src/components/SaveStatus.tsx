import { useEffect, useRef, useState } from 'react';
import { SAVE_STATE_EVENT } from '../lib/saveAttemptToServer';

type Visible = 'saving' | 'saved' | null;
const SAVED_VISIBLE_MS = 3000;

/**
 * Indicador discreto del guardado en la cuenta. "Guardado" solo aparece cuando el servidor lo ha
 * CONFIRMADO; en cualquier fallo se oculta y el aviso lo da SaveFailureBanner.
 */
export default function SaveStatus() {
  const [visible, setVisible] = useState<Visible>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clear = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    };
    const onState = (e: Event) => {
      const state = (e as CustomEvent<{ state?: string }>).detail?.state;
      clear();
      if (state === 'saving') setVisible('saving');
      else if (state === 'saved') {
        setVisible('saved');
        timer.current = setTimeout(() => setVisible(null), SAVED_VISIBLE_MS);
      } else setVisible(null);
    };
    window.addEventListener(SAVE_STATE_EVENT, onState);
    return () => {
      window.removeEventListener(SAVE_STATE_EVENT, onState);
      clear();
    };
  }, []);

  if (!visible) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      id="mira-save-status"
      className="pointer-events-none fixed bottom-4 right-4 z-50 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm"
    >
      {visible === 'saving' ? 'Guardando…' : 'Respuesta guardada en tu cuenta'}
    </div>
  );
}
