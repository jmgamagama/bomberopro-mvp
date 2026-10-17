/**
 * Convierte la base privada de casos prácticos de José (BASE_CASOS_PRACTICOS_CPEI_2026.json,
 * en su Drive) al formato de importación «bomberopro-supuestos» (docs/SUPUESTOS_IMPORT_PRIVADO.md).
 *
 * SOLO USO LOCAL. El resultado es material con derechos de terceros (formación interna del CPEI,
 * academias, etc.): se escribe FUERA del repo, nunca se sube ni entra en el build. Este script no
 * contiene ningún dato real; los lee del archivo que se le pasa.
 *
 * Uso:
 *   npx vite-node scripts/convertir-base-casos.ts <BASE_CASOS.json> /workspace/privado/supuestos_jose.json
 *
 * Qué convierte: los registros de tipo CASO aptos para autocorrección y los que tienen solución
 * (SOLUCION_RESUMEN), salvo las soluciones rechazadas o marcadas «no usar». Cada solución numérica
 * limpia se convierte en preguntas de cálculo; el resto, en una pregunta de desarrollo con la
 * solución como respuesta modelo. El texto viene de OCR: se limpia lo evidente y se avisa.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { parseNumeroUsuario } from '../src/data/supuestos/supuestosCorreccion';
import { FORMATO_IMPORT, VERSION_IMPORT, validarDatosSupuestos } from '../src/data/supuestos/supuestosImport';
import type { PreguntaSupuesto, Supuesto } from '../src/data/supuestos/supuestosTypes';

interface RegistroBase {
  ID: string;
  TIPO_REGISTRO: string;
  TITULO: string;
  TEMAS: string;
  ENUNCIADO_RESUMEN: string;
  TAREAS_PREGUNTAS: string;
  FORMULAS_PROCEDIMIENTOS: string;
  SOLUCION_ESTADO: string;
  SOLUCION_RESUMEN: string;
  APTO_AUTOCORRECCION: string;
  FUENTE: string;
  PAGINAS: string | number;
  AUTORIDAD_FUENTE: string;
  FIABILIDAD?: string;
  ERRORES_TRAMPAS?: string;
}

const REPO = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Limpieza de OCR
// ---------------------------------------------------------------------------

const CORTAS = new Set(
  'a e o u y de el la lo le en un al se si su es ha no ni ya me mi tu te mm cm m l s n kg at cv km h g dm km2 m2 m3 cm2 cm3 v w j kw hp º %'.split(' '),
);

function esBasura(tok: string): boolean {
  const t = tok.toLowerCase().replace(/[.,;:?¿!¡()"]+$/g, '').replace(/^[¿¡("]+/, '');
  if (!t) return true;
  if (/^-?\d+([.,]\d+)?$/.test(t)) return false;
  if (!/^[\p{L}\d][\p{L}\d.,/²³º%'-]*$/u.test(t)) return true;
  if (t.length <= 2 && !CORTAS.has(t)) return true;
  return false;
}

/** Quita los restos del ejercicio anterior y los caracteres sueltos del OCR. */
export function limpiarOcr(texto: string): string {
  const toks = texto.replace(/\s+/g, ' ').trim().split(' ');
  // Segmentos separados por rachas de ≥3 tokens basura; nos quedamos con el último con ≥6 palabras.
  const segmentos: string[][] = [];
  let actual: string[] = [];
  let basura = 0;
  for (const t of toks) {
    if (esBasura(t)) {
      basura++;
      if (basura >= 3 && actual.length) {
        segmentos.push(actual);
        actual = [];
      }
      continue;
    }
    basura = 0;
    actual.push(t);
  }
  if (actual.length) segmentos.push(actual);
  const utiles = segmentos.filter((s) => s.length >= 6);
  let elegido = (utiles.length ? utiles[utiles.length - 1] : segmentos.flat()).join(' ');
  // Si arrastra la solución del ejercicio anterior («… Solución: 64 cm. Pregunta nueva»), se corta.
  const corte = elegido.search(/So[lI1i]uci[o6ó]n\s*:?\s*[^A-Z¿]*?(?=[A-Z¿])/);
  if (corte >= 0) {
    const m = elegido.slice(corte).match(/^So[lI1i]uci[o6ó]n\s*:?\s*[^A-Z¿]*?(?=[A-Z¿])/);
    if (m) elegido = elegido.slice(corte + m[0].length);
  }
  // Restos sueltos al principio («N», «iic 0», «Zo2»…): fuera las palabras de ≤3 caracteres poco probables.
  const INICIO = new Set(['el', 'la', 'los', 'las', 'en', 'un', 'una', 'si', 'al', 'a', 'con', 'por', 'que', 'qué', 'qu6', 'de', 'se']);
  const palabras = elegido.split(' ');
  while (palabras.length > 6 && palabras[0].length <= 3 && !INICIO.has(palabras[0].toLowerCase())) palabras.shift();
  elegido = palabras.join(' ');
  return elegido
    .replace(/\bQu6\b/g, 'Qué')
    .replace(/(?<=\p{Ll})6(?=\p{Ll})/gu, 'ó') // presi6n → presión
    .replace(/(?<=\p{Ll})I|I(?=\p{Ll}*\p{Ll})(?<=\p{Ll})/gu, 'l') // aIcohoI → alcohol
    .replace(/\b[lO0-9][lO0-9.,]*\b/g, (t) => (/\d/.test(t) || /^l?O+$/.test(t) ? t.replace(/l/g, '1').replace(/O/g, '0') : t))
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Soluciones → preguntas
// ---------------------------------------------------------------------------

interface Valor {
  etiqueta: string;
  aproximado: boolean;
  valor: number;
  decimales: number;
  unidad: string;
  resto: string;
}

const NUM = String.raw`(-?\d{1,3}(?:\.\d{3})+(?:,\d+)?|-?\d+(?:[.,]\d+)?)`;
const UNIDAD = String.raw`([A-Za-zº°%²³·/]+[0-9²³]?(?:\/[A-Za-z]+[0-9²³]?)?)?`;

function leerValor(parte: string): Valor | null {
  const t = parte.trim().replace(/\.$/, '');
  const conEtiqueta = t.match(new RegExp(String.raw`^([^=≈]{1,40}?)\s*(=|≈)\s*${NUM}\s*${UNIDAD}\s*(.*)$`, 'u'));
  const solo = t.match(new RegExp(String.raw`^${NUM}\s*${UNIDAD}\s*$`, 'u'));
  const m = conEtiqueta ?? (solo ? [solo[0], '', '=', solo[1], solo[2] ?? '', ''] : null);
  if (!m) return null;
  const valor = parseNumeroUsuario(m[3]);
  if (valor === null) return null;
  const dec = m[3].includes(',') ? m[3].split(',')[1].length : 0;
  return { etiqueta: m[1].trim(), aproximado: m[2] === '≈', valor, decimales: dec, unidad: (m[4] ?? '').trim(), resto: (m[5] ?? '').trim() };
}

function tolerancia(v: Valor): number {
  const redondeo = 0.5 * 10 ** -v.decimales;
  return Number((v.aproximado ? Math.max(redondeo, Math.abs(v.valor) * 0.02) : redondeo).toPrecision(6));
}

const PENDIENTE = /PENDIENTE|DEPENDE/;

function notas(r: RegistroBase): string {
  const partes = [`Solución según la base: «${r.SOLUCION_RESUMEN.trim()}» (estado: ${r.SOLUCION_ESTADO}).`];
  if (PENDIENTE.test(r.SOLUCION_ESTADO)) partes.push('Pendiente de recálculo: compruébala antes de fiarte de ella.');
  if (r.FORMULAS_PROCEDIMIENTOS?.trim()) partes.push(`Fórmulas: ${r.FORMULAS_PROCEDIMIENTOS.trim()}.`);
  if (r.ERRORES_TRAMPAS?.trim()) partes.push(`Trampas: ${r.ERRORES_TRAMPAS.trim()}`);
  return partes.join(' ');
}

function preguntasDe(r: RegistroBase): PreguntaSupuesto[] {
  const fuente = `${r.FUENTE} (págs. ${r.PAGINAS})`;
  const localizacion = `${r.FUENTE.split(/[\\/]/).pop()}, págs. ${r.PAGINAS}`;
  const apto = r.APTO_AUTOCORRECCION.trim().toUpperCase().startsWith('S');
  const valores = r.SOLUCION_RESUMEN.split(';').map(leerValor);
  const limpios = valores.every((v) => v && (apto || !v.resto));
  if (valores.length && limpios) {
    const vs = valores as Valor[];
    return vs.map((v, i) => ({
      id: `${r.ID}-p${i + 1}`,
      tipo: 'calculo' as const,
      enunciado: v.etiqueta ? `Calcula ${v.etiqueta}${v.unidad ? ` (en ${v.unidad})` : ''}.` : `Resultado${v.unidad ? ` (en ${v.unidad})` : ''}.`,
      resultado: v.valor,
      unidad: v.unidad,
      tolerancia: tolerancia(v),
      formula: '',
      pasos: [],
      explicacion: `${notas(r)}${v.resto ? ` Hipótesis: ${v.resto}` : ''}`,
      fuente,
      localizacion,
    }));
  }
  return [
    {
      id: `${r.ID}-p1`,
      tipo: 'desarrollo' as const,
      enunciado: r.TAREAS_PREGUNTAS.trim() || 'Resuelve el supuesto.',
      respuestaModelo: r.SOLUCION_RESUMEN.trim(),
      explicacion: notas(r),
      fuente,
      localizacion,
    },
  ];
}

export function convertir(registros: readonly RegistroBase[]): Supuesto[] {
  return registros
    .filter((r) => r.TIPO_REGISTRO === 'CASO')
    .filter((r) => r.APTO_AUTOCORRECCION.trim().toUpperCase().startsWith('S') || r.SOLUCION_RESUMEN.trim())
    .filter((r) => !/RECHAZADA|NO_USAR/.test(r.SOLUCION_ESTADO))
    .map((r) => {
      let enunciado = limpiarOcr(r.ENUNCIADO_RESUMEN);
      const soloTitulo = enunciado.length < 60 || enunciado === r.TITULO.trim();
      if (soloTitulo) enunciado = `${enunciado}. Los datos del enunciado están en el PDF original: ${r.FUENTE}, págs. ${r.PAGINAS}.`;
      else enunciado += `\n\n(Texto extraído por OCR: puede tener errores; cotéjalo con ${r.FUENTE.split(/[\\/]/).pop()}, pág. ${r.PAGINAS}.)`;
      const temas = [...r.TEMAS.matchAll(/T?(\d{1,2})/g)].map((m) => Number(m[1])).filter((t) => t >= 1 && t <= 40);
      return {
        id: r.ID,
        titulo: r.TITULO.trim(),
        temas,
        enunciado,
        fuentes: [`${r.FUENTE} (págs. ${r.PAGINAS}) · ${r.AUTORIDAD_FUENTE}`, 'Material personal: no se comparte ni se publica'],
        autoria: 'privado' as const,
        preguntas: preguntasDe(r),
      };
    });
}

function main() {
  const [entrada, salida] = process.argv.slice(2).filter((a) => a !== '--');
  if (!entrada || !salida) {
    console.error('Uso: npx vite-node scripts/convertir-base-casos.ts <BASE_CASOS.json> <salida.json fuera del repo>');
    process.exit(2);
  }
  const destino = resolve(salida);
  if (!relative(REPO, destino).startsWith('..')) {
    console.error(`Rechazado: ${destino} está dentro del repo. El material privado debe quedar fuera (p. ej. /workspace/privado/).`);
    process.exit(2);
  }
  const base = JSON.parse(readFileSync(resolve(entrada), 'utf8')) as { casos?: RegistroBase[] };
  const supuestos = convertir(base.casos ?? []);
  const archivo = { formato: FORMATO_IMPORT, version: VERSION_IMPORT, supuestos };
  const v = validarDatosSupuestos(archivo);
  if ('errores' in v) {
    console.error('El resultado no pasa la validación de importación:\n' + v.errores.join('\n'));
    process.exit(1);
  }
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, JSON.stringify(archivo, null, 2));
  const n = (t: string) => supuestos.flatMap((s) => s.preguntas).filter((p) => p.tipo === t).length;
  console.log(`${destino}: ${supuestos.length} supuestos (${n('calculo')} preguntas de cálculo, ${n('desarrollo')} de desarrollo).`);
}

main();
