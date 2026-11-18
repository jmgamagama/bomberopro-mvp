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

// ── Clases del tutor (migración 58) ──────────────────────────────────────────────────────────────
export type EstadoClase = 'borrador' | 'preparada' | 'impartida';
export interface EnlaceClase { titulo: string; url: string }
export interface DatosClase {
  titulo: string;
  fecha: string | null;
  lugar: string;
  temas: number[];
  estado: EstadoClase;
  aviso_alumnos: string;
  notas_tutor: string;
  enlaces: EnlaceClase[];
  pide_lectura: boolean;
  funciono: boolean | null;
}
export interface ClaseTutor extends Omit<DatosClase, 'lugar' | 'aviso_alumnos' | 'notas_tutor'> {
  id: number;
  lugar: string | null;
  aviso_alumnos: string | null;
  notas_tutor: string | null;
  origen_id: number | null;
  alumnos: number;
  leidos: number;
}
export interface AlumnoClase { alumno_id: string; email: string | null; leido_at: string | null; respuestas: number; aciertos_pct: number | null }
export interface ClaseAlumno {
  id: number;
  tutor_nombre: string;
  titulo: string;
  fecha: string | null;
  lugar: string | null;
  aviso_alumnos: string | null;
  enlaces: EnlaceClase[];
  pide_lectura: boolean;
  leida: boolean;
  temas: { numero: number; nombre: string }[];
}

export const getClasesTutor = () => rpc<ClaseTutor[]>('tutor_clases_listar');
export const getDetalleClase = (id: number) => rpc<{ id: number; alumnos: AlumnoClase[] }>('tutor_clase_detalle', { p_id: id });
export const guardarClase = (id: number | null, datos: DatosClase) => rpc<{ ok: boolean; id: number }>('tutor_clase_guardar', { p_id: id, p_datos: datos });
export const duplicarClase = (id: number) => rpc<{ ok: boolean; id: number }>('tutor_clase_duplicar', { p_id: id });
export const borrarClase = (id: number) => rpc<{ ok: boolean }>('tutor_clase_borrar', { p_id: id });
export const getClasesAlumno = () => rpc<ClaseAlumno[]>('alumno_clases_v1');
export const marcarClaseLeida = (id: number) => rpc<{ ok: boolean }>('alumno_marcar_leida', { p_clase: id });

export const CLASE_VACIA: DatosClase = {
  titulo: '', fecha: null, lugar: '', temas: [], estado: 'borrador', aviso_alumnos: '', notas_tutor: '', enlaces: [], pide_lectura: true, funciono: null,
};

/** Guion de clase que combina lo tradicional (papel, oral) con lo que mide la app. Se puede insertar en las notas. */
export const GUION_CLASE =
  'Antes: ficha de lectura del tema (los alumnos confirman en la app).\n' +
  'En clase: repaso oral de los puntos con más fallos y ejercicios en papel.\n' +
  'Cierre: mini-simulacro de 10 preguntas en clase.\n' +
  'Después: test de refuerzo en la app y comentarios en la siguiente clase.';

/** Las cinco cosas que hacen que una clase esté «lista»; el tutor las ve como lista de comprobación. */
export function preparacionClase(c: Pick<DatosClase, 'fecha' | 'temas' | 'aviso_alumnos' | 'enlaces' | 'pide_lectura' | 'notas_tutor'>): { etiqueta: string; hecho: boolean }[] {
  return [
    { etiqueta: 'Fecha y hora', hecho: !!c.fecha },
    { etiqueta: 'Temas elegidos', hecho: c.temas.length > 0 },
    { etiqueta: 'Ficha de lectura', hecho: c.pide_lectura },
    { etiqueta: 'Material o aviso para los alumnos', hecho: c.enlaces.length > 0 || c.aviso_alumnos.trim().length > 0 },
    { etiqueta: 'Plan en clase (repaso oral, simulacro…)', hecho: c.notas_tutor.trim().length > 0 },
  ];
}

export function formatearFechaClase(iso: string | null): string {
  if (!iso) return 'Sin fecha';
  return new Date(iso).toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
}

/** Texto listo para pegar en el grupo de WhatsApp de los alumnos. */
export function textoWhatsApp(c: Pick<DatosClase, 'titulo' | 'fecha' | 'lugar' | 'aviso_alumnos' | 'enlaces' | 'pide_lectura'>, temas: { numero: number; nombre: string }[]): string {
  const l: string[] = [`📚 ${c.titulo}`];
  if (c.fecha) l.push(`🗓 ${formatearFechaClase(c.fecha)}${c.lugar.trim() ? ` · ${c.lugar.trim()}` : ''}`);
  else if (c.lugar.trim()) l.push(`📍 ${c.lugar.trim()}`);
  if (temas.length) l.push(`Temas: ${temas.map(t => `T${t.numero} · ${t.nombre}`).join('; ')}`);
  if (c.aviso_alumnos.trim()) l.push(c.aviso_alumnos.trim());
  for (const e of c.enlaces) l.push(`🔗 ${e.titulo ? `${e.titulo}: ` : ''}${e.url}`);
  if (c.pide_lectura) l.push('✅ Antes de la clase, marca «He leído el tema» en BomberoPro → Más → Mi tutor.');
  return l.join('\n');
}
