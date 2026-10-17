/**
 * Validación del archivo JSON de «Mis supuestos (privado)». Todo ocurre en el navegador:
 * nada se envía a ningún servidor. Esquema: docs/SUPUESTOS_IMPORT_PRIVADO.md.
 *
 * Formato:
 * { "formato": "bomberopro-supuestos", "version": 1, "supuestos": [ ... ] }
 * (también se admite directamente la lista de supuestos).
 */
import type { PasoCalculo, PreguntaSupuesto, Supuesto } from './supuestosTypes';

export const FORMATO_IMPORT = 'bomberopro-supuestos';
export const VERSION_IMPORT = 1;
export const MAX_BYTES_IMPORT = 2 * 1024 * 1024;
export const MAX_SUPUESTOS_IMPORT = 500;
const MAX_PREGUNTAS = 100;
const MAX_TEXTO = 20000;
const ID_RE = /^[A-Za-z0-9_.-]{1,80}$/;
const SIN_FUENTE = 'Material personal (sin fuente indicada)';

export type ResultadoImport =
  | { ok: true; supuestos: Supuesto[]; avisos: string[] }
  | { ok: false; errores: string[] };

type Obj = Record<string, unknown>;
const esObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

class Validador {
  errores: string[] = [];
  avisos: string[] = [];
  error(ruta: string, msg: string) {
    if (this.errores.length < 50) this.errores.push(`${ruta}: ${msg}`);
  }
  texto(o: Obj, campo: string, ruta: string, opts: { obligatorio?: boolean; max?: number } = {}): string {
    const v = o[campo];
    if (v === undefined || v === null || v === '') {
      if (opts.obligatorio) this.error(`${ruta}.${campo}`, 'es obligatorio (texto)');
      return '';
    }
    if (typeof v !== 'string') {
      this.error(`${ruta}.${campo}`, 'debe ser un texto entre comillas');
      return '';
    }
    const t = v.trim();
    if (opts.obligatorio && !t) this.error(`${ruta}.${campo}`, 'no puede estar vacío');
    if (t.length > (opts.max ?? MAX_TEXTO)) this.error(`${ruta}.${campo}`, `es demasiado largo (máx. ${opts.max ?? MAX_TEXTO} caracteres)`);
    return t;
  }
  numero(o: Obj, campo: string, ruta: string, opts: { obligatorio?: boolean; min?: number } = {}): number | undefined {
    const v = o[campo];
    if (v === undefined || v === null || v === '') {
      if (opts.obligatorio) this.error(`${ruta}.${campo}`, 'es obligatorio (número)');
      return undefined;
    }
    if (typeof v !== 'number' || !Number.isFinite(v)) {
      this.error(`${ruta}.${campo}`, 'debe ser un número sin comillas (use punto decimal: 2.5)');
      return undefined;
    }
    if (opts.min !== undefined && v < opts.min) this.error(`${ruta}.${campo}`, `debe ser ≥ ${opts.min}`);
    return v;
  }
}

function validarPregunta(v: Validador, raw: unknown, ruta: string): PreguntaSupuesto | null {
  if (!esObj(raw)) {
    v.error(ruta, 'cada pregunta debe ser un objeto { ... }');
    return null;
  }
  const n0 = v.errores.length;
  const id = v.texto(raw, 'id', ruta, { obligatorio: true, max: 80 });
  if (id && !ID_RE.test(id)) v.error(`${ruta}.id`, 'solo letras sin tilde, números, «-», «_» y «.» (máx. 80)');
  const enunciado = v.texto(raw, 'enunciado', ruta, { obligatorio: true });
  const explicacion = v.texto(raw, 'explicacion', ruta);
  const fuente = v.texto(raw, 'fuente', ruta, { max: 2000 }) || SIN_FUENTE;
  const localizacion = v.texto(raw, 'localizacion', ruta, { max: 500 });
  const base = { id, enunciado, explicacion, fuente, localizacion };
  const tipo = raw.tipo;

  if (tipo === 'test') {
    const opciones = raw.opciones;
    if (!Array.isArray(opciones) || opciones.length < 2 || opciones.length > 6) {
      v.error(`${ruta}.opciones`, 'debe ser una lista de 2 a 6 textos');
      return null;
    }
    const ops = opciones.map((o, i) => {
      if (typeof o !== 'string' || !o.trim()) v.error(`${ruta}.opciones[${i}]`, 'debe ser un texto no vacío');
      return typeof o === 'string' ? o.trim() : '';
    });
    if (new Set(ops.map((o) => o.toLowerCase())).size !== ops.length) v.error(`${ruta}.opciones`, 'hay opciones repetidas');
    const correcta = v.numero(raw, 'correcta', ruta, { obligatorio: true });
    if (correcta !== undefined && !(Number.isInteger(correcta) && correcta >= 0 && correcta < ops.length)) {
      v.error(`${ruta}.correcta`, `debe ser la posición de la opción correcta, empezando en 0 (entre 0 y ${ops.length - 1})`);
    }
    return v.errores.length > n0 ? null : { ...base, tipo, opciones: ops, correcta: correcta! };
  }
  if (tipo === 'calculo') {
    const resultado = v.numero(raw, 'resultado', ruta, { obligatorio: true });
    const unidad = v.texto(raw, 'unidad', ruta, { max: 40 });
    const tolerancia = v.numero(raw, 'tolerancia', ruta, { min: 0 }) ?? 0;
    const formula = v.texto(raw, 'formula', ruta, { max: 1000 });
    let pasos: PasoCalculo[] = [];
    if (raw.pasos !== undefined) {
      if (!Array.isArray(raw.pasos)) v.error(`${ruta}.pasos`, 'debe ser una lista');
      else
        pasos = raw.pasos.flatMap((p, i) => {
          const r = `${ruta}.pasos[${i}]`;
          if (!esObj(p)) {
            v.error(r, 'cada paso debe ser un objeto { ... }');
            return [];
          }
          const paso = {
            descripcion: v.texto(p, 'descripcion', r, { obligatorio: true, max: 1000 }),
            operacion: v.texto(p, 'operacion', r, { max: 500 }),
            resultado: v.numero(p, 'resultado', r, { obligatorio: true }) ?? 0,
            unidad: v.texto(p, 'unidad', r, { max: 40 }),
          };
          return [paso];
        });
    }
    return v.errores.length > n0 ? null : { ...base, tipo, resultado: resultado!, unidad, tolerancia, formula, pasos };
  }
  if (tipo === 'desarrollo') {
    const respuestaModelo = v.texto(raw, 'respuestaModelo', ruta, { obligatorio: true });
    return v.errores.length > n0 ? null : { ...base, tipo, respuestaModelo };
  }
  v.error(`${ruta}.tipo`, 'debe ser "test", "calculo" o "desarrollo"');
  return null;
}

function validarSupuesto(v: Validador, raw: unknown, ruta: string): Supuesto | null {
  if (!esObj(raw)) {
    v.error(ruta, 'cada supuesto debe ser un objeto { ... }');
    return null;
  }
  const n0 = v.errores.length;
  const id = v.texto(raw, 'id', ruta, { obligatorio: true, max: 80 });
  if (id && !ID_RE.test(id)) v.error(`${ruta}.id`, 'solo letras sin tilde, números, «-», «_» y «.» (máx. 80)');
  const titulo = v.texto(raw, 'titulo', ruta, { obligatorio: true, max: 300 });
  const enunciado = v.texto(raw, 'enunciado', ruta, { obligatorio: true });
  let temas: number[] = [];
  if (raw.temas === undefined) temas = [];
  else if (!Array.isArray(raw.temas) || raw.temas.some((t) => !Number.isInteger(t) || (t as number) < 1 || (t as number) > 40)) {
    v.error(`${ruta}.temas`, 'debe ser una lista de números de tema del 1 al 40, p. ej. [21, 33]');
  } else temas = raw.temas as number[];
  let fuentes: string[] = [];
  if (raw.fuentes !== undefined) {
    if (!Array.isArray(raw.fuentes) || raw.fuentes.some((f) => typeof f !== 'string')) v.error(`${ruta}.fuentes`, 'debe ser una lista de textos');
    else fuentes = (raw.fuentes as string[]).map((f) => f.trim()).filter(Boolean);
  }
  const preguntasRaw = raw.preguntas;
  if (!Array.isArray(preguntasRaw) || preguntasRaw.length === 0) {
    v.error(`${ruta}.preguntas`, 'debe ser una lista con al menos una pregunta');
    return null;
  }
  if (preguntasRaw.length > MAX_PREGUNTAS) v.error(`${ruta}.preguntas`, `máximo ${MAX_PREGUNTAS} preguntas por supuesto`);
  const preguntas = preguntasRaw.map((p, i) => validarPregunta(v, p, `${ruta}.preguntas[${i}]`));
  const ids = new Set<string>();
  preguntas.forEach((p, i) => {
    if (!p) return;
    if (ids.has(p.id)) v.error(`${ruta}.preguntas[${i}].id`, `«${p.id}» está repetido dentro del supuesto`);
    ids.add(p.id);
  });
  if (v.errores.length > n0) return null;
  return {
    id,
    titulo,
    temas,
    enunciado,
    fuentes: fuentes.length ? fuentes : [SIN_FUENTE],
    autoria: 'privado',
    preguntas: preguntas as PreguntaSupuesto[],
  };
}

/** Valida el contenido ya leído del archivo (texto). */
export function validarArchivoSupuestos(texto: string): ResultadoImport {
  if (texto.length > MAX_BYTES_IMPORT) return { ok: false, errores: ['El archivo es demasiado grande (máximo 2 MB).'] };
  let datos: unknown;
  try {
    datos = JSON.parse(texto.replace(/^\uFEFF/, ''));
  } catch (e) {
    const detalle = e instanceof Error ? e.message : '';
    return { ok: false, errores: [`El archivo no es un JSON válido. ${detalle}`.trim()] };
  }
  return validarDatosSupuestos(datos);
}

export function validarDatosSupuestos(datos: unknown): ResultadoImport {
  const v = new Validador();
  let lista: unknown;
  if (Array.isArray(datos)) lista = datos;
  else if (esObj(datos)) {
    if (datos.formato !== FORMATO_IMPORT) v.error('formato', `debe ser "${FORMATO_IMPORT}"`);
    if (datos.version !== VERSION_IMPORT) v.error('version', `debe ser ${VERSION_IMPORT}`);
    lista = datos.supuestos;
  } else {
    return { ok: false, errores: ['El JSON debe ser un objeto { "formato": …, "version": 1, "supuestos": [ … ] }.'] };
  }
  if (!Array.isArray(lista) || lista.length === 0) {
    v.error('supuestos', 'debe ser una lista con al menos un supuesto');
    return { ok: false, errores: v.errores };
  }
  if (lista.length > MAX_SUPUESTOS_IMPORT) {
    v.error('supuestos', `máximo ${MAX_SUPUESTOS_IMPORT} supuestos por archivo`);
    return { ok: false, errores: v.errores };
  }
  const supuestos = lista.map((s, i) => validarSupuesto(v, s, `supuestos[${i}]`));
  const ids = new Set<string>();
  supuestos.forEach((s, i) => {
    if (!s) return;
    if (ids.has(s.id)) v.error(`supuestos[${i}].id`, `«${s.id}» está repetido en el archivo`);
    ids.add(s.id);
  });
  if (v.errores.length) return { ok: false, errores: v.errores };
  return { ok: true, supuestos: supuestos as Supuesto[], avisos: v.avisos };
}
