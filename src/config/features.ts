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
 * Plan por usuario (fase B de docs/PLAN_POR_USUARIO.md): el plan sale del servidor (`mi_plan()`),
 * no de la bandera global. Apagada por defecto = cero cambios. Activar solo tras aplicar la
 * migración 53 y comprobar que los correos de los alumnos están en piloto_invitados.
 */
export function isPlanPorUsuarioEnabled(): boolean {
  return String(import.meta.env.VITE_PLAN_POR_USUARIO ?? '').toLowerCase() === 'true';
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
