/**
 * «Mis supuestos (privado)»: supuestos que el usuario importa desde un archivo JSON suyo.
 *
 * - Se guardan SOLO en este navegador (localStorage), con clave por cuenta
 *   (`mira_supuestos_privados_v1:<userId|demo>`, ver src/utils/localOwner.ts).
 * - No se envían a ningún servidor, no se sincronizan y no entran en el repo ni en el build.
 * - Módulo ligero (sin contenido): App.tsx lo usa para saber si mostrar la entrada del menú.
 *
 * Esquema del archivo y ejemplo: docs/SUPUESTOS_IMPORT_PRIVADO.md y
 * docs/ejemplos/supuestos-privados-EJEMPLO.json. Validación: ./supuestosImport.ts.
 */
import { ownedKey } from '../../utils/localOwner';
import type { Supuesto } from './supuestosTypes';

export const SUPUESTOS_PRIVADOS_BASE_KEY = 'mira_supuestos_privados_v1';
/** Evento de ventana que se emite al importar o borrar (para refrescar el menú). */
export const SUPUESTOS_PRIVADOS_EVENT = 'mira-supuestos-privados';

function store(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

function avisarCambio(): void {
  try {
    window.dispatchEvent(new Event(SUPUESTOS_PRIVADOS_EVENT));
  } catch {
    /* sin ventana (tests de Node) */
  }
}

/** Supuestos privados de la cuenta actual (lista vacía si no hay o el dato está dañado). */
export function leerSupuestosPrivados(): Supuesto[] {
  try {
    const raw = store()?.getItem(ownedKey(SUPUESTOS_PRIVADOS_BASE_KEY));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Supuesto[]).filter((s) => s && s.autoria === 'privado') : [];
  } catch {
    return [];
  }
}

export function contarSupuestosPrivados(): number {
  return leerSupuestosPrivados().length;
}

export class AlmacenamientoLlenoError extends Error {
  constructor() {
    super('No hay espacio en el almacenamiento del navegador para guardar estos supuestos.');
  }
}

/**
 * Añade los supuestos (ya validados) a los de la cuenta actual. Un id que ya existe se
 * sustituye por la versión nueva. Devuelve cuántos son nuevos y cuántos se han sustituido.
 */
export function guardarSupuestosPrivados(nuevos: readonly Supuesto[]): { nuevos: number; sustituidos: number } {
  const s = store();
  if (!s) throw new AlmacenamientoLlenoError();
  const actuales = leerSupuestosPrivados();
  const porId = new Map(actuales.map((x) => [x.id, x]));
  let sustituidos = 0;
  for (const n of nuevos) {
    if (porId.has(n.id)) sustituidos++;
    porId.set(n.id, { ...n, autoria: 'privado' });
  }
  try {
    s.setItem(ownedKey(SUPUESTOS_PRIVADOS_BASE_KEY), JSON.stringify([...porId.values()]));
  } catch {
    throw new AlmacenamientoLlenoError();
  }
  avisarCambio();
  return { nuevos: nuevos.length - sustituidos, sustituidos };
}

export function borrarSupuestoPrivado(id: string): void {
  const s = store();
  if (!s) return;
  const quedan = leerSupuestosPrivados().filter((x) => x.id !== id);
  if (quedan.length) s.setItem(ownedKey(SUPUESTOS_PRIVADOS_BASE_KEY), JSON.stringify(quedan));
  else s.removeItem(ownedKey(SUPUESTOS_PRIVADOS_BASE_KEY));
  avisarCambio();
}

export function borrarTodosSupuestosPrivados(): void {
  store()?.removeItem(ownedKey(SUPUESTOS_PRIVADOS_BASE_KEY));
  avisarCambio();
}
