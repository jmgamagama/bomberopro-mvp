import { supabase } from './supabase';

/** Evento global que se emite cuando una respuesta NO se ha podido guardar en el servidor. */
export const SAVE_FAILED_EVENT = 'bomberopro:save-failed';

export type SaveFailureReason = 'session' | 'error';

export interface SaveAttemptParams {
  p_user_id: string;
  p_question_id: number;
  p_acierto: boolean;
  p_respuesta: string | null;
  p_tiempo_ms: number;
  p_modo: string;
  p_session_id: string | null;
  p_nivel: number;
  p_confidence: string | null;
}

export interface SaveAttemptResult {
  ok: boolean;
  reason?: SaveFailureReason;
}

const notifyFailure = (reason: SaveFailureReason) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SAVE_FAILED_EVENT, { detail: { reason } }));
  }
};

/**
 * Guarda un intento con `record_attempt` y avisa al usuario si falla.
 *
 * Por qué existe: la RPC devuelve "éxito" sin guardar nada cuando `auth.uid()` no coincide con
 * `p_user_id` (por ejemplo, sesión caducada). Por eso comprobamos antes que hay una sesión válida
 * del mismo usuario, y además tratamos cualquier error de red/servidor como fallo visible.
 */
export async function saveAttemptToServer(params: SaveAttemptParams): Promise<SaveAttemptResult> {
  if (!supabase) return { ok: true }; // sin backend configurado (modo local/demo): nada que guardar

  try {
    const { data } = await supabase.auth.getSession(); // renueva el token si está caducado
    const sessionUserId = data?.session?.user?.id;
    if (!sessionUserId || sessionUserId !== params.p_user_id) {
      notifyFailure('session');
      return { ok: false, reason: 'session' };
    }

    const { error } = await supabase.rpc('record_attempt', params);
    if (error) {
      console.error('record_attempt error:', error);
      notifyFailure('error');
      return { ok: false, reason: 'error' };
    }
    return { ok: true };
  } catch (err) {
    console.error('record_attempt exception:', err);
    notifyFailure('error');
    return { ok: false, reason: 'error' };
  }
}
