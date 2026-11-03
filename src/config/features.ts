/// <reference types="vite/client" />
/**
 * Banderas de funcionalidad (variables VITE_* en tiempo de build).
 * Se leen en cada llamada para que los tests puedan usar vi.stubEnv.
 */

/** Página de planes y límites Gratis/Pro. Desactivada por defecto. */
export function isPlanesEnabled(): boolean {
  return String(import.meta.env.VITE_FEATURE_PLANES ?? '').toLowerCase() === 'true';
}

/**
 * Registro abierto al público. Por defecto false: piloto cerrado, el alta es solo por invitación
 * (migración 41). Con VITE_REGISTRO_ABIERTO=true la pantalla de entrada vuelve a ofrecer
 * «Crear cuenta gratis». Al abrirlo hay que cambiar también piloto_config.registro_cerrado.
 */
export function isRegistroAbierto(): boolean {
  return String(import.meta.env.VITE_REGISTRO_ABIERTO ?? '').toLowerCase() === 'true';
}

/** Texto del botón que lleva al alta, igual en la entrada, el aviso de la demo y la celebración. */
export function textoAlta(): string {
  return isRegistroAbierto() ? 'Crear cuenta gratis' : 'Activar invitación';
}
