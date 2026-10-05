import { useEffect } from 'react';
import { supabase } from './supabase';
import { flushPendingAttempts } from './saveAttemptToServer';

/**
 * Reenvía las respuestas pendientes de la cuenta cuando hay sesión (al abrir la app o tras
 * iniciar sesión de nuevo) y cada vez que el navegador recupera la conexión.
 */
export function useAttemptSync(userId: string | undefined): void {
  useEffect(() => {
    if (!supabase || !userId) return;
    void flushPendingAttempts();
    const onOnline = () => void flushPendingAttempts();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [userId]);
}
