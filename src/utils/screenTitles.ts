/**
 * Nombre de cada pantalla: se usa en el título de la pestaña, en el anuncio del lector de pantalla,
 * en el menú y en el encabezado de la propia pantalla. Un test (screenTitles.test.ts) comprueba que
 * no se separen: si renombras una pantalla, cámbialo aquí y en su encabezado.
 */
export const SCREEN_TITLES = {
  dashboard: 'Inicio',
  train: 'Entrenamiento',
  errors: 'Errores críticos',
  forgetting_curve: 'Curva de olvido',
  mock_exam: 'Simulacro',
  today_training: 'Entrenamiento de hoy',
  study_by_topic: 'Temas',
  concept_t40: 'Estudiar hoy',
  constitucion: 'Constitución · Título Preliminar',
  my_reports: 'Mis reportes',
  recuerdo: 'Recuerdo',
  sesion_diaria: 'Sesión diaria',
  onboarding: 'Bienvenida',
  planes: 'Planes',
  ordena_pasos: 'Ordena los pasos',
  supuestos: 'Supuestos prácticos',
  mas: 'Más',
} as const;
