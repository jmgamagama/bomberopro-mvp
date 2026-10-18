/**
 * Tus datos en este dispositivo: exportar (copia JSON) y borrar los datos de estudio locales
 * del propietario actual (cuenta o demostración). Base técnica del derecho de acceso y de
 * supresión (RGPD) para lo que vive en el navegador. Nada se envía a ningún sitio.
 *
 * Qué entra:
 * - Claves `mira_*` y `bomberopro:*` que terminan en `:<userId|demo>` (repaso, registro, racha,
 *   tema preferido, progreso por cuenta, colas de envío de esa cuenta).
 * - En demostración, además, las claves de demo de ./db.ts (`mira_demo_*`).
 * - La cola compartida de eventos de concepto se exporta filtrada a las entradas de esta cuenta.
 *
 * Qué NO borra:
 * - Las respuestas aún pendientes de enviar a tu cuenta (colas `pending-attempts` y eventos de
 *   concepto): borrarlas haría perder respuestas que el servidor todavía no tiene.
 * - Lo que ya está guardado en tu cuenta en el servidor, ni datos de otras cuentas del navegador.
 */
import { DEMO_OWNER, getLocalDataOwner } from './localOwner';

const PREFIXES = ['mira_', 'bomberopro:'];
const DEMO_KEYS = ['mira_demo_attempts_v2', 'mira_demo_memory_states_v2'];
const CONCEPT_QUEUE_KEY = 'bomberopro:concept-events:v1';
/** Se exportan pero no se borran (respuestas que el servidor aún no ha confirmado). */
const KEEP_ON_DELETE = ['bomberopro:pending-attempts:'];

function storage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

function allKeys(s: Storage): string[] {
  const keys: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i);
    if (k !== null) keys.push(k);
  }
  return keys.sort();
}

/** Claves locales del propietario actual. */
export function ownedLocalKeys(): string[] {
  const s = storage();
  if (!s) return [];
  const owner = getLocalDataOwner();
  return allKeys(s).filter(
    (k) =>
      PREFIXES.some((p) => k.startsWith(p)) &&
      (k.endsWith(`:${owner}`) || (owner === DEMO_OWNER && DEMO_KEYS.includes(k))),
  );
}

function parse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export interface LocalDataExport {
  app: 'BomberoPro';
  formato: 1;
  exportado: string;
  propietario: string;
  nota: string;
  datos: Record<string, unknown>;
}

export function buildLocalDataExport(now: Date = new Date()): LocalDataExport {
  const s = storage();
  const owner = getLocalDataOwner();
  const datos: Record<string, unknown> = {};
  if (s) {
    for (const k of ownedLocalKeys()) datos[k] = parse(s.getItem(k) ?? '');
    const queue = parse(s.getItem(CONCEPT_QUEUE_KEY) ?? '[]');
    if (Array.isArray(queue)) {
      const mine = queue.filter((e) => (e as { userId?: unknown } | null)?.userId === owner);
      if (mine.length > 0) datos[CONCEPT_QUEUE_KEY] = mine;
    }
  }
  return {
    app: 'BomberoPro',
    formato: 1,
    exportado: now.toISOString(),
    propietario: owner,
    nota: 'Copia de los datos de estudio guardados en este navegador. No incluye lo guardado en tu cuenta en el servidor.',
    datos,
  };
}

/** Descarga la copia como archivo JSON (solo en el navegador). */
export function downloadLocalDataExport(now: Date = new Date()): void {
  const data = buildLocalDataExport(now);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bomberopro-datos-locales-${now.toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** Borra los datos de estudio locales del propietario actual. Devuelve las claves borradas. */
export function deleteLocalStudyData(): string[] {
  const s = storage();
  if (!s) return [];
  const removed: string[] = [];
  for (const k of ownedLocalKeys()) {
    if (KEEP_ON_DELETE.some((p) => k.startsWith(p))) continue;
    try {
      s.removeItem(k);
      removed.push(k);
    } catch {
      // Almacenamiento bloqueado: se informa solo de lo borrado.
    }
  }
  return removed;
}
