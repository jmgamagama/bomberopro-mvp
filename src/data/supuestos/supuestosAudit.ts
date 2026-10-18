/**
 * Auditoría editorial de los supuestos prácticos (misma idea que auditDeck en recallAudit.ts).
 * La usan los tests y scripts/auditar-fichas.ts (docs/AUDITORIA_FICHAS.md).
 */
import { OFFICIAL_DOMAINS } from '../recallAudit';
import type { Supuesto } from './supuestosTypes';

export interface SupuestoIssue {
  supuestoId: string;
  preguntaId?: string;
  problema: string;
}

/**
 * Evalúa una operación aritmética sencilla: números (coma o punto decimal), + − - × * / x y
 * paréntesis. Devuelve null si no es una operación válida. No usa eval.
 */
export function evaluarOperacion(expr: string): number | null {
  const src = expr.replace(/×|x|\*/g, '*').replace(/−/g, '-').replace(/÷/g, '/').replace(/(\d),(\d)/g, '$1.$2');
  const tokens = src.match(/\d+(?:\.\d+)?|[-+*/()]|\S/g) ?? [];
  let i = 0;
  const peek = () => tokens[i];
  function factor(): number | null {
    const t = tokens[i++];
    if (t === undefined) return null;
    if (t === '(') {
      const v = suma();
      if (tokens[i++] !== ')') return null;
      return v;
    }
    if (t === '-') {
      const v = factor();
      return v === null ? null : -v;
    }
    return /^\d/.test(t) ? Number(t) : null;
  }
  function producto(): number | null {
    let v = factor();
    while (v !== null && (peek() === '*' || peek() === '/')) {
      const op = tokens[i++];
      const r = factor();
      if (r === null) return null;
      v = op === '*' ? v * r : v / r;
    }
    return v;
  }
  function suma(): number | null {
    let v = producto();
    while (v !== null && (peek() === '+' || peek() === '-')) {
      const op = tokens[i++];
      const r = producto();
      if (r === null) return null;
      v = op === '+' ? v + r : v - r;
    }
    return v;
  }
  const v = suma();
  return v !== null && i === tokens.length && Number.isFinite(v) ? v : null;
}

function urlsDe(texto: string): string[] {
  return texto.match(/https?:\/\/[^\s)]+/g) ?? [];
}

function esOficial(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return OFFICIAL_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

export function auditSupuesto(s: Supuesto): SupuestoIssue[] {
  const issues: SupuestoIssue[] = [];
  const add = (problema: string, preguntaId?: string) => issues.push({ supuestoId: s.id, preguntaId, problema });

  if (!/^supuesto-[a-z0-9-]+$/.test(s.id)) add('id con formato no válido');
  if (!s.titulo.trim()) add('sin título');
  if (s.enunciado.trim().length < 80) add('enunciado demasiado corto');
  if (s.temas.length === 0) add('sin tema');
  for (const t of s.temas) if (!Number.isInteger(t) || t < 8 || t > 40) add(`tema ${t} fuera de la parte específica (8-40)`);
  if (s.fuentes.length === 0) add('sin fuentes del caso');
  if (s.autoria !== 'original') add('autoría distinta de «original»');
  if (s.preguntas.length < 3) add('menos de 3 preguntas');

  const ids = new Set<string>();
  for (const p of s.preguntas) {
    if (ids.has(p.id)) add('id de pregunta repetido', p.id);
    ids.add(p.id);
    if (!p.enunciado.trim()) add('pregunta sin enunciado', p.id);
    if (!p.explicacion.trim()) add('sin explicación', p.id);
    if (!p.localizacion.trim()) add('sin localización', p.id);
    if (!p.fuente.startsWith(p.localizacion)) add('la fuente no empieza por la localización', p.id);
    const urls = urlsDe(p.fuente);
    if (urls.length === 0) add('fuente sin enlace', p.id);
    for (const u of urls) if (!esOficial(u)) add(`enlace no oficial: ${u}`, p.id);

    if (p.tipo === 'test') {
      if (p.opciones.length !== 4) add('no tiene 4 opciones', p.id);
      if (new Set(p.opciones.map((o) => o.trim().toLowerCase())).size !== p.opciones.length) add('opciones repetidas', p.id);
      if (p.opciones.some((o) => !o.trim())) add('opción vacía', p.id);
      if (!(p.correcta >= 0 && p.correcta < p.opciones.length)) add('índice de opción correcta fuera de rango', p.id);
    } else if (p.tipo === 'desarrollo') {
      if (!p.respuestaModelo.trim()) add('desarrollo sin respuesta modelo', p.id);
    } else {
      if (!p.formula.trim()) add('cálculo sin fórmula', p.id);
      if (p.pasos.length === 0) add('cálculo sin pasos', p.id);
      for (const [n, paso] of p.pasos.entries()) {
        const v = evaluarOperacion(paso.operacion);
        if (v === null) add(`paso ${n + 1}: operación no evaluable «${paso.operacion}»`, p.id);
        else if (Math.abs(v - paso.resultado) > 1e-9) add(`paso ${n + 1}: ${paso.operacion} ≠ ${paso.resultado}`, p.id);
      }
      const ultimo = p.pasos[p.pasos.length - 1];
      if (ultimo && (ultimo.resultado !== p.resultado || ultimo.unidad !== p.unidad)) {
        add('el último paso no coincide con el resultado', p.id);
      }
      if (!(p.tolerancia >= 0)) add('tolerancia negativa', p.id);
    }
  }
  return issues;
}

export function auditSupuestos(lista: readonly Supuesto[]): SupuestoIssue[] {
  const issues = lista.flatMap(auditSupuesto);
  const seen = new Set<string>();
  for (const s of lista) {
    if (seen.has(s.id)) issues.push({ supuestoId: s.id, problema: 'id de supuesto repetido' });
    seen.add(s.id);
  }
  const preguntas = new Set<string>();
  for (const s of lista)
    for (const p of s.preguntas) {
      if (preguntas.has(p.id)) issues.push({ supuestoId: s.id, preguntaId: p.id, problema: 'id de pregunta repetido entre supuestos' });
      preguntas.add(p.id);
    }
  return issues;
}

/** Contenido canónico de un supuesto para su huella de versión en docs/AUDITORIA_FICHAS.md. */
export function canonicalSupuestoContent(s: Supuesto): string {
  return JSON.stringify(s);
}
