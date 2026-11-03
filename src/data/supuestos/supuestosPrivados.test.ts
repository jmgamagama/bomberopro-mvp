// @vitest-environment jsdom
// Importación privada: validación del archivo y almacenamiento solo local, por cuenta.
import '../../test/setup';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { validarArchivoSupuestos, validarDatosSupuestos } from './supuestosImport';
import {
  SUPUESTOS_PRIVADOS_BASE_KEY,
  SUPUESTOS_PRIVADOS_EVENT,
  borrarSupuestoPrivado,
  borrarTodosSupuestosPrivados,
  contarSupuestosPrivados,
  guardarSupuestosPrivados,
  leerSupuestosPrivados,
} from './supuestosPrivados';
import { corregirSupuesto } from './supuestosCorreccion';
import { resetLocalDataOwnerForTests, setLocalDataOwner } from '../../utils/localOwner';

const EJEMPLO = readFileSync(join(process.cwd(), 'docs/ejemplos/supuestos-privados-EJEMPLO.json'), 'utf8');

function errores(datos: unknown): string[] {
  const r = validarDatosSupuestos(datos);
  return 'errores' in r ? r.errores : [];
}
const ok = (datos: unknown) => {
  const r = validarDatosSupuestos(datos);
  if ('errores' in r) throw new Error(r.errores.join('\n'));
  return r.supuestos;
};
const base = () => JSON.parse(EJEMPLO);

beforeEach(() => {
  window.localStorage.clear();
  resetLocalDataOwnerForTests();
});
afterEach(() => vi.restoreAllMocks());

describe('validación del archivo', () => {
  it('el ejemplo de docs es válido, está marcado como EJEMPLO y tiene los 3 tipos de pregunta', () => {
    const [s] = ok(base());
    expect(s.autoria).toBe('privado');
    expect(s.titulo).toMatch(/^EJEMPLO/);
    expect(s.preguntas.every((p) => /EJEMPLO/.test(p.enunciado))).toBe(true);
    expect(new Set(s.preguntas.map((p) => p.tipo))).toEqual(new Set(['test', 'calculo', 'desarrollo']));
  });

  it('acepta también la lista directa de supuestos', () => {
    expect(ok(base().supuestos)).toHaveLength(1);
  });

  it('JSON roto, tamaño excesivo o raíz equivocada dan un mensaje claro', () => {
    expect((validarArchivoSupuestos('{ "formato": ') as { errores: string[] }).errores[0]).toMatch(/^El archivo no es un JSON válido/);
    expect((validarArchivoSupuestos(' '.repeat(2 * 1024 * 1024 + 1)) as { errores: string[] }).errores[0]).toMatch(/demasiado grande/);
    expect(errores('hola')[0]).toMatch(/debe ser un objeto/);
    expect(errores({ formato: 'otro', version: 2, supuestos: [] })).toEqual([
      'formato: debe ser "bomberopro-supuestos"',
      'version: debe ser 1',
      'supuestos: debe ser una lista con al menos un supuesto',
    ]);
  });

  it('señala cada campo mal con su ruta', () => {
    const d = base();
    const s = d.supuestos[0];
    delete s.titulo;
    s.temas = [0, 50];
    s.preguntas[0].correcta = 4;
    s.preguntas[0].opciones = ['a', 'A', 'b'];
    s.preguntas[1].resultado = '2000';
    s.preguntas[2].tipo = 'abierta';
    s.preguntas[3].id = 'EJEMPLO-01-p1';
    delete s.preguntas[3].respuestaModelo;
    const e = errores(d);
    expect(e).toContain('supuestos[0].titulo: es obligatorio (texto)');
    expect(e).toContain('supuestos[0].temas: debe ser una lista de números de tema del 1 al 40, p. ej. [21, 33]');
    expect(e).toContain('supuestos[0].preguntas[0].opciones: hay opciones repetidas');
    expect(e).toContain('supuestos[0].preguntas[0].correcta: debe ser la posición de la opción correcta, empezando en 0 (entre 0 y 2)');
    expect(e).toContain('supuestos[0].preguntas[1].resultado: debe ser un número sin comillas (use punto decimal: 2.5)');
    expect(e).toContain('supuestos[0].preguntas[2].tipo: debe ser "test", "calculo" o "desarrollo"');
    expect(e).toContain('supuestos[0].preguntas[3].respuestaModelo: es obligatorio (texto)');
  });

  it('detecta ids repetidos e ids con caracteres no admitidos', () => {
    const d = base();
    d.supuestos.push(JSON.parse(JSON.stringify(d.supuestos[0])));
    d.supuestos[1].preguntas[1].id = d.supuestos[1].preguntas[0].id;
    expect(errores(d)).toEqual(
      expect.arrayContaining([
        'supuestos[1].preguntas[1].id: «EJEMPLO-01-p1» está repetido dentro del supuesto',
      ]),
    );
    const d2 = base();
    d2.supuestos.push({ ...JSON.parse(JSON.stringify(d2.supuestos[0])) });
    expect(errores(d2)).toContain('supuestos[1].id: «EJEMPLO-01» está repetido en el archivo');
    const d3 = base();
    d3.supuestos[0].id = 'caso uno/ñ';
    expect(errores(d3)[0]).toMatch(/^supuestos\[0\]\.id: solo letras sin tilde/);
  });

  it('pone valores por defecto (fuente, tolerancia, pasos) y no admite autoría ajena', () => {
    const d = base();
    d.supuestos[0].autoria = 'original';
    delete d.supuestos[0].fuentes;
    const [s] = ok(d);
    expect(s.autoria).toBe('privado');
    expect(s.fuentes).toEqual(['Material personal (sin fuente indicada)']);
    const p4 = s.preguntas[3];
    expect(p4.fuente).toBe('EJEMPLO');
    const p3 = s.preguntas[2];
    expect(p3.tipo === 'calculo' && p3.pasos).toEqual([]);
  });
});

describe('almacenamiento local por cuenta', () => {
  it('guarda, sustituye por id, borra uno y borra todos; avisa con un evento', () => {
    const escucha = vi.fn();
    window.addEventListener(SUPUESTOS_PRIVADOS_EVENT, escucha);
    const [s] = ok(base());
    expect(guardarSupuestosPrivados([s])).toEqual({ nuevos: 1, sustituidos: 0 });
    expect(guardarSupuestosPrivados([{ ...s, titulo: 'EJEMPLO v2' }, { ...s, id: 'EJEMPLO-02' }])).toEqual({ nuevos: 1, sustituidos: 1 });
    expect(leerSupuestosPrivados().map((x) => [x.id, x.titulo])).toEqual([
      ['EJEMPLO-01', 'EJEMPLO v2'],
      ['EJEMPLO-02', s.titulo],
    ]);
    expect(window.localStorage.getItem(`${SUPUESTOS_PRIVADOS_BASE_KEY}:demo`)).not.toBeNull();
    borrarSupuestoPrivado('EJEMPLO-01');
    expect(contarSupuestosPrivados()).toBe(1);
    borrarTodosSupuestosPrivados();
    expect(contarSupuestosPrivados()).toBe(0);
    expect(window.localStorage.getItem(`${SUPUESTOS_PRIVADOS_BASE_KEY}:demo`)).toBeNull();
    expect(escucha).toHaveBeenCalledTimes(4);
    window.removeEventListener(SUPUESTOS_PRIVADOS_EVENT, escucha);
  });

  it('dos cuentas en el mismo navegador no se ven los supuestos', () => {
    const [s] = ok(base());
    setLocalDataOwner('ana');
    guardarSupuestosPrivados([s]);
    expect(contarSupuestosPrivados()).toBe(1);
    setLocalDataOwner('luis');
    expect(contarSupuestosPrivados()).toBe(0);
    setLocalDataOwner(null);
    expect(contarSupuestosPrivados()).toBe(0);
    setLocalDataOwner('ana');
    expect(leerSupuestosPrivados()[0].id).toBe('EJEMPLO-01');
  });

  it('un dato dañado en el almacenamiento no rompe nada', () => {
    window.localStorage.setItem(`${SUPUESTOS_PRIVADOS_BASE_KEY}:demo`, '{roto');
    expect(leerSupuestosPrivados()).toEqual([]);
  });

  it('no hace ninguna petición de red al importar', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const r = validarArchivoSupuestos(EJEMPLO);
    if ('errores' in r) throw new Error('el ejemplo debería ser válido');
    guardarSupuestosPrivados(r.supuestos);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('corrección de un supuesto privado', () => {
  it('las preguntas de desarrollo cuentan según la autoevaluación', () => {
    const [s] = ok(base());
    const resp = { 'EJEMPLO-01-p1': 1, 'EJEMPLO-01-p2': '2.000', 'EJEMPLO-01-p3': '20,4 min' };
    expect(corregirSupuesto(s, resp).aciertos).toBe(3);
    expect(corregirSupuesto(s, resp, { 'EJEMPLO-01-p4': true }).aciertos).toBe(4);
    expect(corregirSupuesto(s, resp, { 'EJEMPLO-01-p4': false }).aciertos).toBe(3);
  });
});
