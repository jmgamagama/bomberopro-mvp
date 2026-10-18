/**
 * Modelo de datos del modo «Supuestos prácticos».
 *
 * Un supuesto es un caso (enunciado + temas + fuentes) con varias preguntas. Cada pregunta es
 * de tipo test (4 opciones, una correcta) o de cálculo (resultado numérico con sus pasos), y
 * lleva SIEMPRE su explicación y su fuente oficial con localización.
 *
 * Reglas de contenido (docs/SUPUESTOS_PRACTICOS.md):
 * - Casos ORIGINALES: ni texto, ni cifras de enunciados, ni preguntas del CEP o del material
 *   interno del CPEI (que no entra en el repo ni en el bundle).
 * - Cada dato y cada respuesta sale de una fuente oficial gratuita ya usada en las fichas.
 * - Solo hay cálculo si la fórmula sale de la fuente oficial citada.
 */

export interface FuenteCitada {
  /** Fuente completa con enlace oficial (mismo formato que las fichas de recuerdo). */
  fuente: string;
  /** Artículo, apartado o página. */
  localizacion: string;
}

interface PreguntaBase extends FuenteCitada {
  id: string;
  enunciado: string;
  /** Por qué es así, con la referencia a la fuente. */
  explicacion: string;
}

export interface PreguntaTest extends PreguntaBase {
  tipo: 'test';
  /** Exactamente 4 opciones. */
  opciones: readonly [string, string, string, string];
  /** Índice (0-3) de la opción correcta. */
  correcta: 0 | 1 | 2 | 3;
}

export interface PasoCalculo {
  descripcion: string;
  /** Operación aritmética con números, «+ − × /» y paréntesis; la auditoría la recalcula. */
  operacion: string;
  resultado: number;
  unidad: string;
}

export interface PreguntaCalculo extends PreguntaBase {
  tipo: 'calculo';
  /** Fórmula tal como se deduce de la fuente. */
  formula: string;
  pasos: readonly PasoCalculo[];
  /** Resultado esperado (igual al del último paso). */
  resultado: number;
  unidad: string;
  /** Margen absoluto admitido al corregir (0 = exacto). */
  tolerancia: number;
}

export type PreguntaSupuesto = PreguntaTest | PreguntaCalculo;

export interface Supuesto {
  /** Id estable; es también la clave de revisión en src/data/recallReview.ts. */
  id: string;
  titulo: string;
  /** Temas del anexo I (parte específica: 8 a 40). */
  temas: readonly number[];
  enunciado: string;
  /** Fuentes oficiales del caso (resumen; el detalle va en cada pregunta). */
  fuentes: readonly string[];
  /** Autoría del caso: siempre «original» (escrito para BomberoPro). */
  autoria: 'original';
  preguntas: readonly PreguntaSupuesto[];
}
