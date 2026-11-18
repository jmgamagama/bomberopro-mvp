/**
 * Nombre canónico de cada pantalla: título de pestaña, anuncio y encabezado visible.
 * Mantener los nombres alineados con la navegación; la prueba screenTitles.test.ts lo comprueba.
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
  constitucion: 'Material por tema',
  my_reports: 'Mis reportes',
  recuerdo: 'Tarjetas pro',
  sesion_diaria: 'Sesión diaria',
  onboarding: 'Bienvenida',
  planes: 'Planes',
  ordena_pasos: 'Ordena los pasos',
  supuestos: 'Supuestos prácticos',
  mas: 'Más',
  progreso: 'Tu progreso',
  mi_tutor: 'Mi tutor',
  panel_tutor: 'Panel de tutor',
} as const;
