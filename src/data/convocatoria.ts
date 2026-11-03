/**
 * Datos de la convocatoria que se muestran al opositor en la bienvenida.
 * Fuente única: bases publicadas en el BOP de Badajoz nº 135, de 17/07/2026
 * (anuncio 2843/2026). No añadir datos sin fuente oficial.
 */

export const CONVOCATORIA_CPEI_2026 = {
  organismo: 'CPEI Badajoz',
  organismoCompleto:
    'Consorcio para la Prestación del Servicio de Prevención y Extinción de Incendios en la Provincia de Badajoz',
  plaza: 'Conductor/a Bombero/a',
  plazas: 38,
  /** Base primera: 9 plazas de la OEP 2024 y 29 de la OEP 2026. */
  desglosePlazas: '9 OEP 2024 + 29 OEP 2026',
  bases: 'BOP de Badajoz nº 135, de 17/07/2026',
  anuncio: '2843/2026',
  /** Aún no publicada: las bases remiten a un anuncio posterior con lugar, fecha y hora. */
  fechaExamen: null as string | null,
  /**
   * Primera prueba (tipo test): «El 30% de las preguntas de esta prueba tendrán que ver
   * con los temas del anexo I del número 35 al 40.» (bases, BOP nº 135, 17/07/2026).
   */
  pesoTemasLocales: {
    texto: 'El 30 % de las preguntas del test versa sobre los temas 35 a 40.',
    fuente: 'Bases, primera prueba (BOP nº 135, 17/07/2026)',
    /** Mismos datos en forma numérica (para el consejo de ritmo; ver src/utils/studyPlan.ts). */
    temaDesde: 35,
    temaHasta: 40,
    porcentaje: 30,
  },
} as const;
