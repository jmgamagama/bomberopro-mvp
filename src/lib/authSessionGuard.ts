/**
 * Evita que una respuesta tardía de Auth sustituya una sesión más nueva (P1 #296).
 *
 * `conTiempoLimite` usa `Promise.race` y no cancela `signInWithPassword`. El SDK, al recibir
 * el HTTP de A después de que B ya entró, llama a `_saveSession(A)` y emite `SIGNED_IN(A)`.
 * Esta guarda envuelve `fetch` del cliente: cada petición que puede escribir una sesión
 * (`/token?grant_type=password`, `/signup`) lleva un número de intento; si al llegar la
 * respuesta ya hay un intento más nuevo (reintento o la otra pestaña, vía localStorage),
 * se descarta y el SDK no guarda ni notifica esa sesión. La comprobación se repite tras leer el
 * cuerpo completo, porque cabeceras y cuerpo pueden llegar en momentos distintos.
 *
 * No cancela la petición HTTP en el servidor; solo impide que una respuesta obsoleta se
 * aplique en este dispositivo. Los refrescos (`grant_type=refresh_token`) no incrementan
 * el intento ni se descartan.
 */
export const AUTH_EPOCH_KEY = 'bomberopro:auth-attempt-epoch:v1';

let memoryEpoch = 0;

function store(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function currentAuthEpoch(): number {
  let stored = 0;
  try {
    stored = Number.parseInt(store()?.getItem(AUTH_EPOCH_KEY) ?? '0', 10) || 0;
  } catch {
    stored = 0;
  }
  return Math.max(memoryEpoch, stored);
}

/** Abre un intento nuevo de acceso que puede escribir sesión. Visible entre pestañas. */
export function beginAuthAttempt(): number {
  const next = currentAuthEpoch() + 1;
  memoryEpoch = next;
  try {
    store()?.setItem(AUTH_EPOCH_KEY, String(next));
  } catch {
    /* almacenamiento bloqueado: basta el contador en memoria de esta pestaña */
  }
  return next;
}

export function resetAuthAttemptForTests(): void {
  memoryEpoch = 0;
  try {
    store()?.removeItem(AUTH_EPOCH_KEY);
  } catch {
    /* nada */
  }
}

/** Peticiones cuyo cuerpo de éxito hace que el SDK guarde sesión y emita SIGNED_IN. */
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
    const epochAtStart = isAuthSessionWriteUrl(url) ? beginAuthAttempt() : undefined;
    const response = await baseFetch(input, init);
    if (epochAtStart === undefined) return response;
    if (currentAuthEpoch() !== epochAtStart) throw staleAttemptError();
    if (response.body && !response.bodyUsed) {
      try {
        await response.clone().arrayBuffer();
      } catch {
        /* el original fallará igual al leerlo; el SDK no guardará sesión */
      }
    }
    if (currentAuthEpoch() !== epochAtStart) throw staleAttemptError();
    return response;
  };
}
