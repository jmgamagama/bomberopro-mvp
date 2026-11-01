/**
 * Progreso de invitado (sin cuenta) → cuenta nueva.
 *
 * Sin cuenta, el progreso vive en este navegador bajo el propietario «demo»:
 *   - claves `mira_*` / `bomberopro:*` que terminan en `:demo` (fichas, racha, tema…; ver localOwner.ts),
 *   - `mira_demo_attempts_v2` y `mira_demo_memory_states_v2` (test y simulacro; ver db.ts).
 * Solo se copia a una cuenta si el invitado pulsó «Guardar mi progreso» / «Crear cuenta» en este
 * navegador (intención explícita): así nadie hereda el progreso de otra persona en un equipo compartido.
 * Nunca se sobrescribe un dato que la cuenta ya tenga. El original de invitado se conserva.
 */
const INTENT_KEY = 'bomberopro:guest-signup-intent:v1';
const DONE_PREFIX = 'bomberopro:guest-migrated-to:v1:';
const PREFIXES = ['mira_', 'bomberopro:'];
const DEMO_MAP: Record<string, string> = {
  mira_demo_attempts_v2: 'mira_attempts_v1',
  mira_demo_memory_states_v2: 'mira_memory_states_v1',
};
/** Claves de servicio que no son progreso. */
const SKIP = [INTENT_KEY, 'bomberopro:funnel-log:v1', 'bomberopro:pending-attempts:', 'bomberopro:rejected-attempts:'];

function store(): Storage | null {
  try { return typeof window !== 'undefined' ? window.localStorage : null; } catch { return null; }
}

export function markGuestSignupIntent(): void {
  store()?.setItem(INTENT_KEY, new Date().toISOString());
}

export function hasGuestSignupIntent(): boolean {
  return store()?.getItem(INTENT_KEY) != null;
}

/** Claves de progreso de invitado presentes → clave destino para `userId`. */
export function guestKeyPlan(userId: string, s: Storage | null = store()): Array<[string, string]> {
  if (!s) return [];
  const out: Array<[string, string]> = [];
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i);
    if (!k || SKIP.some((p) => k.startsWith(p))) continue;
    if (DEMO_MAP[k]) out.push([k, `${DEMO_MAP[k]}:${userId}`]);
    else if (PREFIXES.some((p) => k.startsWith(p)) && k.endsWith(':demo')) out.push([k, `${k.slice(0, -':demo'.length)}:${userId}`]);
  }
  return out;
}

/**
 * Copia el progreso de invitado a la cuenta si hubo intención de registrarse. Devuelve las claves
 * copiadas. Idempotente: una segunda llamada no copia nada.
 */
export function migrateGuestProgress(userId: string): string[] {
  const s = store();
  if (!s || !userId || !hasGuestSignupIntent()) return [];
  const copied: string[] = [];
  try {
    for (const [from, to] of guestKeyPlan(userId, s)) {
      if (s.getItem(to) !== null) continue;
      const v = s.getItem(from);
      if (v === null) continue;
      s.setItem(to, v);
      copied.push(to);
    }
    s.setItem(DONE_PREFIX + userId, new Date().toISOString());
    s.removeItem(INTENT_KEY);
  } catch {
    /* almacenamiento lleno: se reintenta en el próximo inicio de sesión */
  }
  return copied;
}

const PREFER_LOGIN_KEY = 'bomberopro:prefer-login:v1';
/** El alumno pidió la pantalla de acceso (salió de la demo o ya tuvo sesión): no se le manda a invitado. */
export function markPreferLogin(): void { store()?.setItem(PREFER_LOGIN_KEY, '1'); }
export function prefersLogin(): boolean {
  const s = store();
  if (!s) return false;
  if (s.getItem(PREFER_LOGIN_KEY) === '1') return true;
  // Respuestas pendientes de una cuenta (sesión caducada): hay que volver a entrar, no ir a invitado.
  for (let i = 0; i < s.length; i++) if (s.key(i)?.startsWith('bomberopro:pending-attempts:v1:')) return true;
  return false;
}
