/// <reference types="vite/client" />
// Primero: captura el hash de los enlaces de correo antes de que supabase-js lo limpie.
import './authRetorno';
/**
 * Cliente Supabase con carga diferida.
 *
 * `@supabase/supabase-js` (≈90 KiB gzip) ya no va en el bundle inicial: se importa al primer uso
 * real (leer la sesión, registrarse, una RPC…). `supabase` sigue siendo un objeto síncrono con la
 * misma forma que usa la app (auth.*, rpc, from), así que el resto del código no cambia:
 * - los constructores de consultas (`rpc(...)`, `from(...).select()…`) se graban y se ejecutan al
 *   hacer `await`/`then`, que es cuando PostgREST las lanza de todos modos;
 * - `auth.onAuthStateChange` devuelve su suscripción al momento y se engancha al cliente al cargar.
 * Un invitado sin sesión guardada solo dispara la carga cuando la app lo necesita (p. ej. getSession),
 * pero ya no bloquea el primer pintado. `getSupabaseClient()` da el cliente real.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let resolveClient!: (c: SupabaseClient) => void;
let rejectClient!: (e: unknown) => void;
const clientReady = new Promise<SupabaseClient>((ok, ko) => { resolveClient = ok; rejectClient = ko; });
let loading = false;
/** Carga (una vez) supabase-js y crea el cliente real. */
export function getSupabaseClient(): Promise<SupabaseClient> {
  if (!loading) {
    loading = true;
    import('@supabase/supabase-js').then(({ createClient }) => resolveClient(createClient(supabaseUrl, supabaseAnonKey)), rejectClient);
  }
  return clientReady;
}

/**
 * ¿Hay (o va a haber) una sesión de Supabase? Clave `sb-<ref>-auth-token` guardada, o vuelta de un
 * enlace mágico/OAuth con los tokens en la URL (#access_token, ?code=, error de auth).
 */
export function hasStoredSession(): boolean {
  try {
    if (typeof location !== 'undefined' && /access_token=|refresh_token=|error_description=/.test(location.hash + location.search)) return true;
    if (typeof location !== 'undefined' && /[?&]code=/.test(location.search)) return true;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) ?? '';
      if (k.startsWith('sb-') && k.endsWith('-auth-token')) return true;
    }
  } catch {
    /* sin almacenamiento: se trata como invitado */
  }
  return false;
}

/** Invitado sin sesión: el cliente se carga cuando el navegador está libre, no en el arranque. */
function loadWhenIdle() {
  const w = typeof window !== 'undefined' ? (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }) : undefined;
  if (w?.requestIdleCallback) w.requestIdleCallback(() => void getSupabaseClient(), { timeout: 4000 });
  else setTimeout(() => void getSupabaseClient(), 1500);
}

type Op = { key: PropertyKey; args: unknown[] };

/**
 * Proxy que graba una cadena (`rpc(a).setHeader(b)`, `from(t).select().order()`) y la ejecuta sobre
 * el cliente real al esperarla. Los pasos intermedios NO se esperan: los constructores de PostgREST
 * son «thenables» y esperarlos los lanzaría antes de tiempo.
 */
function deferredChain(root: (c: SupabaseClient) => unknown, ops: readonly Op[] = []): unknown {
  const run = async () => {
    // Invitado sin sesión: sus llamadas (p. ej. el embudo) esperan a que el navegador esté libre
    // en vez de traer supabase-js durante el primer pintado.
    if (!loading && !hasStoredSession()) loadWhenIdle();
    const client = await (loading || hasStoredSession() ? getSupabaseClient() : clientReady);
    let t: any = root(client);
    for (const op of ops) t = t[op.key](...op.args);
    return t; // la propia `then` de la promesa externa espera al constructor final
  };
  return new Proxy(function deferred() {}, {
    get(_t, key) {
      if (key === 'then') return (ok?: any, ko?: any) => run().then(ok, ko);
      if (key === 'catch') return (ko?: any) => run().catch(ko);
      if (key === 'finally') return (f?: any) => run().finally(f);
      return (...args: unknown[]) => deferredChain(root, [...ops, { key, args }]);
    },
  });
}

function createLazyClient(): SupabaseClient {
  const lazyAuthCall = (name: string) => async (...args: unknown[]) => {
    const auth: any = (await getSupabaseClient()).auth;
    return auth[name](...args);
  };
  const auth = {
    // Sin sesión guardada no hace falta el cliente para saber que no hay sesión.
    getSession: (...args: unknown[]) =>
      loading || hasStoredSession() ? lazyAuthCall('getSession')(...args) : Promise.resolve({ data: { session: null }, error: null }),
    getUser: lazyAuthCall('getUser'),
    signOut: lazyAuthCall('signOut'),
    signInWithOtp: lazyAuthCall('signInWithOtp'),
    signInWithPassword: lazyAuthCall('signInWithPassword'),
    signUp: lazyAuthCall('signUp'),
    onAuthStateChange(cb: (...a: unknown[]) => void) {
      let cancelled = false;
      let real: { unsubscribe: () => void } | null = null;
      void clientReady.then((c) => {
        if (!cancelled) real = c.auth.onAuthStateChange(cb as never).data.subscription;
      }, () => {});
      if (hasStoredSession()) void getSupabaseClient();
      else loadWhenIdle();
      return { data: { subscription: { unsubscribe: () => { cancelled = true; real?.unsubscribe(); } } } };
    },
  };
  const builder = (method: 'rpc' | 'from') => (...args: unknown[]) =>
    deferredChain((c) => (c as any)[method](...args));
  return { auth, rpc: builder('rpc'), from: builder('from') } as unknown as SupabaseClient;
}

export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey ? createLazyClient() : null;

export const isSupabaseConfigured = () => supabase !== null;
