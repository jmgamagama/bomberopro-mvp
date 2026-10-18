/**
 * Supuestos privados de la cuenta guardados en Supabase (tabla public.private_supuestos,
 * migración 21). Solo los ve su dueño (RLS: owner_id = auth.uid()); el contenido NO está en el
 * repo ni en el bundle. Se validan con el mismo esquema que la importación local y se guardan
 * solo en memoria (src/data/supuestos/supuestosPrivados.ts).
 *
 * Falla en silencio: sin Supabase, sin sesión, sin la tabla (migración no aplicada) o con
 * cualquier error, la app sigue igual y simplemente no hay supuestos de la cuenta.
 */
import { supabase } from './supabase';
import { getLocalDataOwner } from '../utils/localOwner';
import { limpiarSupuestosCuenta, setSupuestosCuenta } from '../data/supuestos/supuestosPrivados';
import type { Supuesto } from '../data/supuestos/supuestosTypes';

export const PRIVATE_SUPUESTOS_TABLE = 'private_supuestos';
const MAX_FILAS = 1000;

let peticion = 0;

/** Pide los supuestos de `userId` y los deja disponibles. Devuelve los válidos (o [] si falla). */
export async function cargarSupuestosCuenta(userId: string | null): Promise<Supuesto[]> {
  const mia = ++peticion;
  if (!userId || !supabase) {
    limpiarSupuestosCuenta();
    return [];
  }
  try {
    const { data, error } = await supabase
      .from(PRIVATE_SUPUESTOS_TABLE)
      .select('payload')
      .eq('owner_id', userId)
      .order('created_at', { ascending: true })
      .limit(MAX_FILAS);
    if (error || !Array.isArray(data)) {
      if (mia === peticion) limpiarSupuestosCuenta();
      return [];
    }
    const { validarDatosSupuestos } = await import('../data/supuestos/supuestosImport');
    const porId = new Map<string, Supuesto>();
    for (const fila of data as { payload?: unknown }[]) {
      const r = validarDatosSupuestos([fila?.payload]);
      if ('supuestos' in r) for (const s of r.supuestos) porId.set(s.id, s); // una fila inválida no tumba las demás
    }
    const lista = [...porId.values()];
    // Descarta respuestas tardías (cambio de cuenta o petición más nueva).
    if (mia !== peticion || getLocalDataOwner() !== userId) return [];
    setSupuestosCuenta(userId, lista);
    return lista;
  } catch {
    if (mia === peticion) limpiarSupuestosCuenta();
    return [];
  }
}
