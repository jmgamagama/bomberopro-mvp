/**
 * Panel de tutor (migración 57). Toda la seguridad está en el servidor: estas funciones solo
 * llaman a las RPC y dan forma a la respuesta. Un tutor solo ve a los alumnos que han
 * introducido su código; el alumno puede revocar cuando quiera.
 */
import { supabase } from './supabase';

export interface TutorVinculado { tutor_id: string; nombre: string; desde: string }
export interface EstadoTutor { es_tutor: boolean; nombre?: string; codigo?: string }
export interface AlumnoResumen {
  alumno_id: string;
  email: string | null;
  desde: string;
  ultima_actividad: string | null;
  dias_activos: number;
  minutos: number;
  respuestas: number;
  aciertos_pct: number | null;
  seguro_y_falla: number;
}
export interface TemaDetalle {
  tema: number;
  nombre: string | null;
  respuestas: number;
  aciertos_pct: number | null;
  minutos: number;
  dudas: number;
  seguro_y_falla: number;
  ultima: string | null;
}
export interface AlumnoDetalle {
  email: string | null;
  dias: number;
  temas: TemaDetalle[];
  serie_14d: { dia: string; minutos: number }[];
}
export type ResultadoVinculo =
  | { ok: true; tutor_id: string; tutor_nombre: string }
  | { ok: false; motivo: 'codigo_invalido' | 'propio' | 'limite' | 'error' };

async function rpc<T>(nombre: string, args?: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new Error('sin_supabase');
  const { data, error } = await supabase.rpc(nombre, args);
  if (error) throw error;
  return data as T;
}

export const getEsTutor = () => rpc<EstadoTutor>('get_es_tutor');
export const getMisTutores = () => rpc<TutorVinculado[]>('get_mis_tutores');
export const revocarTutor = (tutorId: string) => rpc<{ ok: boolean }>('revocar_tutor', { p_tutor_id: tutorId });
export const getPanelTutor = (dias = 14) => rpc<{ dias: number; alumnos: AlumnoResumen[] }>('get_panel_tutor_v1', { p_dias: dias });
export const getPanelTutorAlumno = (alumnoId: string, dias = 30) =>
  rpc<AlumnoDetalle>('get_panel_tutor_alumno_v1', { p_alumno: alumnoId, p_dias: dias });

export async function vincularTutor(codigo: string): Promise<ResultadoVinculo> {
  try {
    const r = await rpc<{ ok: boolean; motivo?: string; tutor_id?: string; tutor_nombre?: string }>('vincular_tutor', { p_codigo: codigo });
    if (r.ok && r.tutor_id) return { ok: true, tutor_id: r.tutor_id, tutor_nombre: r.tutor_nombre ?? '' };
    return { ok: false, motivo: r.motivo === 'propio' ? 'propio' : 'codigo_invalido' };
  } catch (e) {
    const msg = String((e as { message?: string })?.message ?? '');
    return { ok: false, motivo: msg.includes('rate_limited') ? 'limite' : 'error' };
  }
}

/** Texto corto y legible: «1 h 05 min», «12 min», «0 min». */
export function formatearMinutos(min: number): string {
  const total = Math.round(min);
  if (total < 60) return `${total} min`;
  return `${Math.floor(total / 60)} h ${String(total % 60).padStart(2, '0')} min`;
}

/** Lectura del nivel de un tema para el tutor, solo con datos suficientes (≥10 respuestas). */
export function lecturaTema(t: Pick<TemaDetalle, 'respuestas' | 'aciertos_pct' | 'seguro_y_falla'>): { etiqueta: string; tono: 'ok' | 'medio' | 'alerta' | 'neutro' } {
  if (t.respuestas < 10 || t.aciertos_pct == null) return { etiqueta: 'Pocos datos', tono: 'neutro' };
  if (t.aciertos_pct >= 80) return { etiqueta: 'Consolidado', tono: 'ok' };
  if (t.aciertos_pct >= 60) return { etiqueta: 'En progreso', tono: 'medio' };
  return { etiqueta: 'Necesita refuerzo', tono: 'alerta' };
}
