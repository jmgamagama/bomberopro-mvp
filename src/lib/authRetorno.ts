/**
 * Vuelta a la app desde un enlace de correo de Supabase Auth (confirmar cuenta, invitación,
 * entrar con enlace, recuperar contraseña).
 *
 * Supabase redirige a `emailRedirectTo` con los datos en el hash (#access_token=…&type=signup)
 * o, si el enlace no vale, con el error (#error=access_denied&error_code=otp_expired&…).
 * supabase-js borra ese hash al leer la sesión, así que lo capturamos al cargar el módulo,
 * antes de crear el cliente (src/lib/supabase.ts importa este archivo primero).
 */

export type TipoRetornoOk = 'registro' | 'invitacion' | 'recuperar' | 'enlace' | 'oauth';
export type RetornoAuth = { tipo: TipoRetornoOk } | { tipo: 'error'; codigo: string };

/** Parámetro que la app añade a emailRedirectTo para saber de qué correo viene el alumno. */
export const PARAM_ACCESO = 'acceso';

const TIPOS_SUPABASE: Record<string, TipoRetornoOk> = {
  signup: 'registro',
  email: 'registro',
  invite: 'invitacion',
  recovery: 'recuperar',
  magiclink: 'enlace',
};

const TIPOS_APP: Record<string, TipoRetornoOk> = {
  registro: 'registro',
  enlace: 'enlace',
  recuperar: 'recuperar',
  oauth: 'oauth',
};

/** Lee la URL de vuelta. Devuelve null si no viene de un enlace de correo. */
export function leerRetornoAuth(href: string): RetornoAuth | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const hash = new URLSearchParams(url.hash.replace(/^#/, ''));
  const query = url.searchParams;

  const codigo = hash.get('error_code') || query.get('error_code') || hash.get('error') || query.get('error');
  // Vuelta de Google/Apple con error (p. ej. el alumno canceló): se distingue del enlace caducado.
  if (codigo) return { tipo: 'error', codigo: query.get(PARAM_ACCESO) === 'oauth' ? `oauth_${codigo}` : codigo };

  if (hash.get('access_token')) {
    const tipo = TIPOS_SUPABASE[hash.get('type') ?? ''];
    if (tipo) return { tipo };
  }
  const acceso = TIPOS_APP[query.get(PARAM_ACCESO) ?? ''];
  return acceso ? { tipo: acceso } : null;
}

/** URL a la que debe volver el alumno desde el correo (mismo dominio en el que está la app). */
export function urlRetornoAuth(tipo: 'registro' | 'enlace' | 'recuperar' | 'oauth', origin = baseRetorno()): string {
  return `${origin.replace(/\/+$/, '')}/?${PARAM_ACCESO}=${tipo}`;
}

/**
 * Dominio de vuelta: el origen actual si es http(s) (producción, previews, localhost); si no
 * (app empaquetada, file://…), VITE_SITE_URL. Supabase solo acepta los que estén en Redirect URLs;
 * si no está, manda a la Site URL (docs/AUTH_CHECKLIST.md).
 */
export function baseRetorno(
  origin: string = typeof window === 'undefined' ? '' : window.location.origin,
  siteUrl: string = String(import.meta.env.VITE_SITE_URL ?? ''),
): string {
  if (/^https?:\/\//.test(origin)) return origin;
  return siteUrl || 'https://bomberopro-mvp.vercel.app';
}

/** Marca «estoy cambiando la contraseña» (evento PASSWORD_RECOVERY de supabase-js). */
export function marcarRecuperacionPendiente(): void {
  try {
    window.sessionStorage.setItem(CLAVE_PENDIENTE, 'recuperar');
  } catch {
    // Sin almacenamiento: la pantalla sigue abierta mientras no se recargue.
  }
}

/** Quita de la barra de direcciones los restos del enlace (?acceso=…, #error=…). */
export function limpiarUrlRetornoAuth(): void {
  try {
    window.sessionStorage.removeItem(CLAVE_PENDIENTE);
  } catch {
    // Almacenamiento bloqueado: nada que borrar.
  }
  try {
    window.history.replaceState(window.history.state, '', window.location.pathname);
  } catch {
    // Sin History API no pasa nada: solo es estética.
  }
}

/**
 * Invitación y recuperar contraseña solo traen su tipo en el hash, que supabase-js borra. Si el
 * alumno recarga antes de guardar la contraseña, el formulario debe seguir ahí: se recuerda en
 * sessionStorage (esta pestaña) hasta que guarda o pulsa «Ahora no» (limpiarUrlRetornoAuth).
 */
const CLAVE_PENDIENTE = 'bp-acceso-pendiente';

export function capturarRetornoAuth(href: string): RetornoAuth | null {
  const retorno = leerRetornoAuth(href);
  try {
    if (retorno?.tipo === 'invitacion' || retorno?.tipo === 'recuperar') {
      window.sessionStorage.setItem(CLAVE_PENDIENTE, retorno.tipo);
      return retorno;
    }
    if (retorno) return retorno;
    const pendiente = window.sessionStorage.getItem(CLAVE_PENDIENTE);
    return pendiente === 'invitacion' || pendiente === 'recuperar' ? { tipo: pendiente } : null;
  } catch {
    return retorno;
  }
}

/** Capturado una sola vez al cargar la app, antes de que supabase-js limpie el hash. */
export const retornoAuthInicial: RetornoAuth | null =
  typeof window === 'undefined' ? null : capturarRetornoAuth(window.location.href);
