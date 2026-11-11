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
 * Plan por usuario (docs/PLAN_POR_USUARIO.md, fase B). Apagada por defecto: `getPlan()` sigue siendo el de siempre.
 * Encendida, el plan sale del servidor (`mi_plan()`): sin sesión es «free» y con sesión lo decide la lista de la beta.
 * Antes de encenderla hay que cambiar el contenido de muestra del plan gratis (hoy regala `tema40`, material interno).
 */
export function isPlanPorUsuarioEnabled(): boolean {
  return String(import.meta.env.VITE_PLAN_POR_USUARIO ?? '').toLowerCase() === 'true';
}

/**
 * ¿Se aplican accesos y límites según el plan? Con los planes de pago visibles o con el plan por usuario.
 * No muestra la página de precios: eso sigue dependiendo solo de `isPlanesEnabled()`.
 */
export function limitesPorPlanActivos(): boolean {
  return isPlanesEnabled() || isPlanPorUsuarioEnabled();
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
