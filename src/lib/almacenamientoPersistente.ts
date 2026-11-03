/**
 * Pide al navegador que no borre los datos de estudio locales (`mira_*`) por falta de espacio o inactividad.
 * Sin esto, Safari/iOS y a veces Chrome pueden purgar localStorage, y el alumno perdería su repaso.
 *
 * - Solo se pide una vez por sesión de pestaña.
 * - Nunca lanza ni bloquea: si el navegador no lo soporta o lo rechaza, no pasa nada.
 * - No envía nada fuera del dispositivo.
 */
let solicitado = false;

export async function solicitarAlmacenamientoPersistente(): Promise<boolean> {
  if (solicitado) return false;
  solicitado = true;
  try {
    const storage = typeof navigator === 'undefined' ? undefined : navigator.storage;
    if (!storage || typeof storage.persist !== 'function') return false;
    if (typeof storage.persisted === 'function' && (await storage.persisted())) return true;
    return await storage.persist();
  } catch {
    return false;
  }
}

/** Solo para pruebas: permite repetir la petición. */
export function reiniciarSolicitudAlmacenamiento(): void {
  solicitado = false;
}
