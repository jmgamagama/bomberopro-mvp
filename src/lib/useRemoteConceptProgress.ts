import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';
import type { ConceptProgress } from './conceptEngine';
import { SAVE_STATE_EVENT } from './saveAttemptToServer';

export type RemoteConceptState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: ConceptProgress | null };

export function useRemoteConceptProgress(userId: string | null, active: boolean) {
  const context = useRef({ userId, active, key: 0 });
  if (context.current.userId !== userId || context.current.active !== active) {
    context.current = { userId, active, key: context.current.key + 1 };
  }
  const request = useRef(0);
  const [snapshot, setSnapshot] = useState<{ key: number; state: RemoteConceptState }>({ key: -1, state: { status: 'loading' } });
  const refresh = useCallback(async () => {
    if (!userId || !active) return;
    const key = context.current.key;
    const version = ++request.current;
    const current = () => context.current.key === key && version === request.current;
    setSnapshot({ key, state: { status: 'loading' } });
    try {
      if (!supabase) throw new Error('backend_not_configured');
      const { data: auth, error: authError } = await supabase.auth.getSession();
      if (authError || auth.session?.user?.id !== userId || !auth.session.access_token) throw new Error('session_mismatch');
      if (!current()) return;
      const { data, error } = await supabase.rpc('get_concept_progress', { p_topic: null })
        .setHeader('Authorization', `Bearer ${auth.session.access_token}`);
      if (error) throw error;
      if (current()) setSnapshot({ key, state: { status: 'ready', data: data as ConceptProgress | null } });
    } catch {
      if (current()) setSnapshot({ key, state: { status: 'error' } });
    }
  }, [userId, active]);

  useEffect(() => {
    if (!userId || !active) return;
    void refresh();
    let timer: number | undefined;
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => { void refresh(); }, 100);
    };
    const saved = (event: Event) => { if ((event as CustomEvent).detail?.state === 'saved') schedule(); };
    const storage = (event: StorageEvent) => { if (event.key?.startsWith('bomberopro:concept-events:v1')) schedule(); };
    window.addEventListener('focus', schedule);
    window.addEventListener('online', schedule);
    window.addEventListener('storage', storage);
    window.addEventListener(SAVE_STATE_EVENT, saved);
    return () => {
      request.current += 1;
      window.clearTimeout(timer);
      window.removeEventListener('focus', schedule);
      window.removeEventListener('online', schedule);
      window.removeEventListener('storage', storage);
      window.removeEventListener(SAVE_STATE_EVENT, saved);
    };
  }, [userId, active, refresh]);
  return { state: snapshot.key === context.current.key ? snapshot.state : { status: 'loading' } as RemoteConceptState, refresh };
}
