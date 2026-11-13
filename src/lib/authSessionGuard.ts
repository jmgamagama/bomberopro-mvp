/**
 * Evita que una respuesta tardía de Auth sustituya una sesión más nueva (P1 #296).
 *
 * `conTiempoLimite` usa `Promise.race` y no cancela `signInWithPassword`. El SDK, al recibir
 * el HTTP de A después de que B ya entró, llama a `_saveSession(A)` y emite `SIGNED_IN(A)`.
 * Esta guarda envuelve `fetch` del cliente: cada petición que puede escribir una sesión
 * (`/token?grant_type=password`, `/signup`) lleva un identificador único de intento; si al
 * llegar la respuesta el identificador compartido (localStorage, visible entre pestañas) ya
 * no es el de este intento, se descarta y el SDK no guarda ni notifica esa sesión. Un
 * identificador único evita la colisión del contador monótono: si dos pestañas leen el
 * mismo valor y después escriben el mismo «siguiente» número, ambas aceptarían la respuesta.
 * La comprobación se repite tras leer el cuerpo completo, porque cabeceras y cuerpo pueden
 * llegar en momentos distintos.
 *
 * No cancela la petición HTTP en el servidor; solo impide que una respuesta obsoleta se
 * aplique en este dispositivo. Los refrescos (`grant_type=refresh_token`) no registran
 * un intento nuevo ni se descartan.
 */
export const AUTH_EPOCH_KEY = 'bomberopro:auth-attempt-epoch:v1';

let memoryAttemptId = '';
let attemptSeq = 0;

function store(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

function newAuthAttemptId(): string {
  attemptSeq += 1;
  const uniq = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  return `${uniq}-${attemptSeq}`;
}

/** Identificador del último intento de acceso visto en este dispositivo (almacén compartido). */
export function currentAuthAttemptId(): string {
  try {
    const stored = store()?.getItem(AUTH_EPOCH_KEY);
    if (stored) return stored;
  } catch {
    /* almacenamiento bloqueado: se usa el de esta pestaña */
  }
  return memoryAttemptId;
}

/** @deprecated el intento ya no es un contador; se conserva para no romper imports de prueba. */
export function currentAuthEpoch(): string {
  return currentAuthAttemptId();
}

/** Abre un intento nuevo de acceso que puede escribir sesión. Visible entre pestañas. */
export function beginAuthAttempt(): string {
  const id = newAuthAttemptId();
  memoryAttemptId = id;
  try {
    store()?.setItem(AUTH_EPOCH_KEY, id);
  } catch {
    /* almacenamiento bloqueado: basta el identificador en memoria de esta pestaña */
  }
  return id;
}

export function resetAuthAttemptForTests(): void {
  memoryAttemptId = '';
  attemptSeq = 0;
  try {
    store()?.removeItem(AUTH_EPOCH_KEY);
  } catch {
    /* nada */
  }
}

/** Peticiones cuyo cuerpo de éxito hace que el SDK guarde sesión y emite SIGNED_IN. */
export function isAuthSessionWriteUrl(url: string): boolean {
  try {
    const u = new URL(url, 'http://local');
    if (u.pathname.endsWith('/token') && u.searchParams.get('grant_type') === 'password') return true;
    if (u.pathname.endsWith('/signup')) return true;
    return false;
  } catch {
    return /\/token\?grant_type=password/.test(url) || /\/signup(\?|$)/.test(url);
  }
}

function staleAttemptError(): Error {
  const err = new Error('The user aborted a request.');
  err.name = 'AbortError';
  return err;
}

/**
 * La comprobación del intento se hace DESPUÉS de leer el cuerpo completo (#298): si solo se
 * mirara al llegar las cabeceras, el cuerpo de A podría llegar después de que B entre y el SDK
 * guardaría A al hacer `response.json()`. Leemos una copia (`clone()`) para que el SDK siga
 * pudiendo consumir el original; el cuerpo ya está en memoria y su lectura no espera más red.
 * Si la lectura de la copia falla (red cortada, cancelación), se entrega la respuesta tal cual:
 * el SDK leerá el mismo error del original y no guardará sesión.
 */
export function wrapAuthFetch(baseFetch: typeof fetch = fetch): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const attemptAtStart = isAuthSessionWriteUrl(url) ? beginAuthAttempt() : undefined;
    const response = await baseFetch(input, init);
    if (attemptAtStart === undefined) return response;
    if (currentAuthAttemptId() !== attemptAtStart) throw staleAttemptError();
    if (response.body && !response.bodyUsed) {
      try {
        await response.clone().arrayBuffer();
      } catch {
        /* el original fallará igual al leerlo; el SDK no guardará sesión */
      }
    }
    if (currentAuthAttemptId() !== attemptAtStart) throw staleAttemptError();
    return response;
  };
}
