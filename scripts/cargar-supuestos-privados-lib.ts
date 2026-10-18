/**
 * Lógica de scripts/cargar-supuestos-privados.ts (separada para poder probarla sin red).
 * NO la importa la app: no entra en el build.
 */
import { readFileSync, realpathSync } from 'node:fs';
import { dirname, relative, resolve, sep, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validarArchivoSupuestos } from '../src/data/supuestos/supuestosImport';
import type { Supuesto } from '../src/data/supuestos/supuestosTypes';

export const TABLA = 'private_supuestos';
export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface Opciones {
  archivo: string;
  email?: string;
  ownerId?: string;
  dryRun: boolean;
  replace: boolean;
}

export const USO = `Uso:
  npx vite-node scripts/cargar-supuestos-privados.ts <archivo.json FUERA del repo> (--email X | --owner-id UUID) [--dry-run] [--replace]

  --dry-run   Solo valida el archivo y muestra el plan. No se conecta a Supabase.
  --replace   Además borra las filas de ese usuario cuyo id ya no está en el archivo.

Variables (solo sin --dry-run): SUPABASE_URL (o VITE_SUPABASE_URL) y SUPABASE_SERVICE_ROLE_KEY.`;

export function parsearArgs(argv: readonly string[]): Opciones {
  const o: Partial<Opciones> = { dryRun: false, replace: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') o.dryRun = true;
    else if (a === '--replace') o.replace = true;
    else if (a === '--email' || a === '--owner-id') {
      const v = argv[++i];
      if (!v || v.startsWith('--')) throw new Error(`Falta el valor de ${a}.`);
      if (a === '--email') o.email = v.trim().toLowerCase();
      else o.ownerId = v.trim();
    } else if (a.startsWith('--')) throw new Error(`Opción desconocida: ${a}`);
    else if (o.archivo) throw new Error('Solo se admite un archivo.');
    else o.archivo = a;
  }
  if (!o.archivo) throw new Error('Falta el archivo JSON.');
  if (!!o.email === !!o.ownerId) throw new Error('Indica exactamente uno: --email o --owner-id.');
  if (o.email && !EMAIL.test(o.email)) throw new Error('El email no es válido.');
  if (o.ownerId && !UUID.test(o.ownerId)) throw new Error('--owner-id debe ser un UUID.');
  return o as Opciones;
}

/** El contenido privado nunca debe estar dentro del repo: se rechaza cualquier ruta dentro de él. */
export function comprobarRutaFueraDelRepo(archivo: string, repo = REPO_ROOT): string {
  const abs = resolve(archivo);
  let real = abs;
  try {
    real = realpathSync(abs);
  } catch {
    throw new Error(`No existe el archivo: ${abs}`);
  }
  let repoReal = repo;
  try {
    repoReal = realpathSync(repo);
  } catch {
    /* repo inexistente en pruebas */
  }
  for (const [ruta, base] of [[abs, repo], [real, repoReal]] as const) {
    const rel = relative(base, ruta);
    const fuera = rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel);
    if (!fuera) {
      throw new Error('El archivo está DENTRO del repo. El material privado debe quedarse fuera (p. ej. /workspace/privado/).');
    }
  }
  return real;
}

export function leerYValidar(archivo: string): { supuestos: Supuesto[]; avisos: string[] } {
  const r = validarArchivoSupuestos(readFileSync(archivo, 'utf8'));
  if ('errores' in r) throw new Error(`El archivo no es válido:\n  - ${r.errores.slice(0, 30).join('\n  - ')}`);
  return { supuestos: r.supuestos, avisos: r.avisos };
}

/** Lo que se guarda en payload: el supuesto tal como lo valida la app (sin la marca de autoría local). */
export function aPayload(s: Supuesto): Record<string, unknown> {
  const { autoria: _autoria, ...resto } = s as Supuesto & { autoria?: string };
  return resto as Record<string, unknown>;
}

export interface Plan {
  insertar: Supuesto[];
  actualizar: { rowId: string; supuesto: Supuesto }[];
  borrar: string[];
}

export function planificar(supuestos: readonly Supuesto[], existentes: readonly { id: string; supuesto_id: string | null }[], replace: boolean): Plan {
  const porSupuesto = new Map<string, string>();
  for (const e of existentes) if (e.supuesto_id && !porSupuesto.has(e.supuesto_id)) porSupuesto.set(e.supuesto_id, e.id);
  const plan: Plan = { insertar: [], actualizar: [], borrar: [] };
  const enArchivo = new Set(supuestos.map((s) => s.id));
  for (const s of supuestos) {
    const rowId = porSupuesto.get(s.id);
    if (rowId) plan.actualizar.push({ rowId, supuesto: s });
    else plan.insertar.push(s);
  }
  const usadas = new Set(plan.actualizar.map((a) => a.rowId));
  for (const e of existentes) {
    // Duplicados de un mismo supuesto o filas que ya no están en el archivo.
    const sobra = !usadas.has(e.id) && (!e.supuesto_id || !enArchivo.has(e.supuesto_id) || porSupuesto.get(e.supuesto_id) !== e.id);
    if (replace && sobra) plan.borrar.push(e.id);
  }
  return plan;
}

/** Interfaz mínima del cliente de Supabase que usa el script (permite simularlo en pruebas). */
export interface ClienteAdmin {
  buscarUsuarioPorEmail(email: string): Promise<string | null>;
  filasDe(ownerId: string): Promise<{ id: string; supuesto_id: string | null }[]>;
  insertar(filas: { owner_id: string; payload: Record<string, unknown> }[]): Promise<void>;
  actualizar(rowId: string, payload: Record<string, unknown>): Promise<void>;
  borrar(rowIds: string[]): Promise<void>;
}

export interface Resultado {
  ownerId: string | null;
  plan: Plan | null;
  escrito: boolean;
}

export async function ejecutar(
  opciones: Opciones,
  deps: { env: Record<string, string | undefined>; crearCliente?: (url: string, key: string) => ClienteAdmin; log?: (m: string) => void }
): Promise<Resultado> {
  const log = deps.log ?? ((m: string) => console.log(m));
  const ruta = comprobarRutaFueraDelRepo(opciones.archivo);
  const { supuestos, avisos } = leerYValidar(ruta);
  log(`Archivo válido: ${supuestos.length} supuestos (${supuestos.reduce((n, s) => n + s.preguntas.length, 0)} preguntas).`);
  if (avisos.length) log(`Avisos: ${avisos.length} (no impiden la carga).`);
  const destino = opciones.ownerId ? `owner_id ${opciones.ownerId}` : `email ${opciones.email}`;

  if (opciones.dryRun) {
    log(`[dry-run] Se cargarían ${supuestos.length} supuestos para ${destino} en public.${TABLA}${opciones.replace ? ' (con --replace)' : ''}.`);
    log(`[dry-run] Ids: ${supuestos.map((s) => s.id).join(', ')}`);
    log('[dry-run] No se ha contactado con Supabase ni se ha escrito nada.');
    return { ownerId: opciones.ownerId ?? null, plan: null, escrito: false };
  }

  const url = deps.env.SUPABASE_URL || deps.env.VITE_SUPABASE_URL;
  const key = deps.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Faltan SUPABASE_URL (o VITE_SUPABASE_URL) y/o SUPABASE_SERVICE_ROLE_KEY. Usa --dry-run para solo validar.');
  if (!deps.crearCliente) throw new Error('No hay cliente de Supabase.');
  const cliente = deps.crearCliente(url, key);

  const ownerId = opciones.ownerId ?? (await cliente.buscarUsuarioPorEmail(opciones.email!));
  if (!ownerId) throw new Error(`No hay ningún usuario de Supabase Auth con el email ${opciones.email}.`);
  const plan = planificar(supuestos, await cliente.filasDe(ownerId), opciones.replace);
  log(`Usuario ${ownerId}: ${plan.insertar.length} nuevos, ${plan.actualizar.length} actualizados, ${plan.borrar.length} borrados.`);
  if (plan.insertar.length) await cliente.insertar(plan.insertar.map((s) => ({ owner_id: ownerId, payload: aPayload(s) })));
  for (const a of plan.actualizar) await cliente.actualizar(a.rowId, aPayload(a.supuesto));
  if (plan.borrar.length) await cliente.borrar(plan.borrar);
  log('Hecho.');
  return { ownerId, plan, escrito: true };
}

/** Cliente real con @supabase/supabase-js y la service role (solo se crea sin --dry-run). */
export async function crearClienteSupabase(url: string, key: string): Promise<ClienteAdmin> {
  const { createClient } = await import('@supabase/supabase-js');
  const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const fallo = (q: string, e: { message?: string } | null) => {
    if (e) throw new Error(`${q}: ${e.message ?? 'error desconocido'}`);
  };
  return {
    async buscarUsuarioPorEmail(email) {
      for (let page = 1; page <= 50; page++) {
        const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 });
        fallo('listUsers', error);
        const usuarios = (data?.users ?? []) as { id: string; email?: string | null }[];
        const u = usuarios.find((x) => (x.email ?? '').toLowerCase() === email);
        if (u) return u.id;
        if (usuarios.length < 200) break;
      }
      return null;
    },
    async filasDe(ownerId) {
      const { data, error } = await sb.from(TABLA).select('id, supuesto_id:payload->>id').eq('owner_id', ownerId);
      fallo('select', error);
      return (data ?? []) as unknown as { id: string; supuesto_id: string | null }[];
    },
    async insertar(filas) {
      const { error } = await sb.from(TABLA).insert(filas);
      fallo('insert', error);
    },
    async actualizar(rowId, payload) {
      const { error } = await sb.from(TABLA).update({ payload, updated_at: new Date().toISOString() }).eq('id', rowId);
      fallo('update', error);
    },
    async borrar(rowIds) {
      const { error } = await sb.from(TABLA).delete().in('id', rowIds);
      fallo('delete', error);
    },
  };
}
