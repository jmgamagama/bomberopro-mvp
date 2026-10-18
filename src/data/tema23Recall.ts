/** Tema 23 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (BOE-A-2011-14277). Calidad: data/tema23/tema23_calidad.md. */

export type Tema23RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA23_RECALL_META = {
  "tema": 23,
  "title": "Tema 23 · Inundaciones: Plan Estatal de Protección Civil ante el Riesgo de Inundaciones",
  "count": 21,
  "source": "Fase 3 · texto consolidado BOE-A-2011-14277 (Plan Estatal de Inundaciones; últ. act. 19/12/2025)"
} as const;

export const TEMA23_RECALL_CARDS: Tema23RecallCard[] = [
  {
    "id": "CPEI-T23-OF-0FD68107",
    "orden": 10,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿qué tres zonas climatológicas se distinguen en España de forma muy general?",
    "respuesta": "Una de clara influencia atlántica, otra de influencia mediterránea y otra continental",
    "fuente": "Plan Estatal de Inundaciones, 1. Objeto y ámbito, apdo. 1.1. BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A1",
    "localizacion": "Plan Estatal de Inundaciones, 1. Objeto y ámbito, apdo. 1.1",
    "apartado": "Tipos de inundación y marco"
  },
  {
    "id": "CPEI-T23-OF-F058C5CE",
    "orden": 20,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿qué causas pueden provocar o potenciar las inundaciones por escorrentía, avenida o desbordamiento de cauces?",
    "respuesta": "Precipitaciones, deshielo o fusión de nieve, obstrucción de cauces naturales o artificiales, invasión de cauces, aterramientos o dificultad de avenamiento y acción de las mareas",
    "fuente": "Plan Estatal de Inundaciones, 1. Objeto y ámbito, apdo. 1.1. BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A1",
    "localizacion": "Plan Estatal de Inundaciones, 1. Objeto y ámbito, apdo. 1.1",
    "apartado": "Tipos de inundación y marco"
  },
  {
    "id": "CPEI-T23-OF-DBB24F6A",
    "orden": 30,
    "concepto": "¿Qué Acuerdo del Consejo de Ministros aprobó la Directriz Básica de Planificación de Protección Civil ante el riesgo de inundaciones vigente, que sustituye a la de 1994 citada en el apdo. 1.2 del Plan Estatal de Inundaciones?",
    "respuesta": "El Acuerdo del Consejo de Ministros de 21 de abril de 2026 (publicado por Resolución de 23 de abril de 2026; efectos desde el 28 de abril de 2026)",
    "fuente": "Directriz Básica de Planificación de Protección Civil ante el riesgo de inundaciones, título y acuerdo cuarto (derogación del Acuerdo de 9/12/1994). BOE-A-2026-9160: https://www.boe.es/buscar/doc.php?id=BOE-A-2026-9160 · Sustituye a la Directriz citada en el Plan Estatal de Inundaciones, apdo. 1.2 (BOE-A-2011-14277): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A1",
    "localizacion": "Directriz Básica de inundaciones 2026 (BOE-A-2026-9160), acuerdo cuarto; Plan Estatal de Inundaciones, apdo. 1.2",
    "apartado": "Tipos de inundación y marco"
  },
  {
    "id": "CPEI-T23-OF-7D057DD1",
    "orden": 40,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿qué niveles de planificación considera la Directriz de Inundaciones?",
    "respuesta": "Estatal, autonómico y de ámbito local",
    "fuente": "Plan Estatal de Inundaciones, 1. Objeto y ámbito, apdo. 1.2. BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A1",
    "localizacion": "Plan Estatal de Inundaciones, 1. Objeto y ámbito, apdo. 1.2",
    "apartado": "Tipos de inundación y marco"
  },
  {
    "id": "CPEI-T23-OF-21F69FB8",
    "orden": 50,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿qué apartado de la Norma Básica de Protección Civil dispone que el riesgo de inundaciones será objeto de planes especiales?",
    "respuesta": "Apartado 6",
    "fuente": "Plan Estatal de Inundaciones, 1. Objeto y ámbito, apdo. 1.2. BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A1",
    "localizacion": "Plan Estatal de Inundaciones, 1. Objeto y ámbito, apdo. 1.2",
    "apartado": "Tipos de inundación y marco"
  },
  {
    "id": "CPEI-T23-OF-0FEE7093",
    "orden": 60,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿qué real decreto rige la identificación del riesgo de inundaciones?",
    "respuesta": "Real Decreto 903/2010, de 9 de julio, de evaluación y gestión de riesgos de inundación",
    "fuente": "Plan Estatal de Inundaciones, 2. Identificación del riesgo de inundaciones en España, apdo. 2. BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A2",
    "localizacion": "Plan Estatal de Inundaciones, 2. Identificación del riesgo de inundaciones en España, apdo. 2",
    "apartado": "Tipos de inundación y marco"
  },
  {
    "id": "CPEI-T23-OF-7D8DB258",
    "orden": 70,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿qué sistema es la referencia cartográfica para delimitar las zonas con riesgo de inundaciones?",
    "respuesta": "El Sistema Nacional de Cartografía de Zonas Inundables (SNCZI)",
    "fuente": "Plan Estatal de Inundaciones, 2. Identificación del riesgo de inundaciones en España, apdo. 2. BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A2",
    "localizacion": "Plan Estatal de Inundaciones, 2. Identificación del riesgo de inundaciones en España, apdo. 2",
    "apartado": "Tipos de inundación y marco"
  },
  {
    "id": "CPEI-T23-OF-CD1B1372",
    "orden": 80,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿qué directiva europea traspone el RD 903/2010?",
    "respuesta": "La Directiva Europea de Inundaciones (2007/60/CE)",
    "fuente": "Plan Estatal de Inundaciones, 2. Identificación del riesgo de inundaciones en España, apdo. 2. BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A2",
    "localizacion": "Plan Estatal de Inundaciones, 2. Identificación del riesgo de inundaciones en España, apdo. 2",
    "apartado": "Tipos de inundación y marco"
  },
  {
    "id": "CPEI-T23-OF-26AD74A5",
    "orden": 90,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿qué caracteriza a la fase de pre-emergencia?",
    "respuesta": "La existencia de información sobre la posibilidad de ocurrencia de sucesos capaces de dar lugar a inundaciones",
    "fuente": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.A). BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A4",
    "localizacion": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.A)",
    "apartado": "Fases y situaciones"
  },
  {
    "id": "CPEI-T23-OF-1D1D3C3D",
    "orden": 100,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿cuál es el objetivo general de la fase de pre-emergencia?",
    "respuesta": "La alerta de las autoridades y servicios implicados en el plan correspondiente, así como la información a la población potencialmente afectada",
    "fuente": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.A). BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A4",
    "localizacion": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.A)",
    "apartado": "Fases y situaciones"
  },
  {
    "id": "CPEI-T23-OF-2B32A458",
    "orden": 110,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿a quién corresponden los medios de vigilancia y seguimiento en inundaciones por precipitación «in situ»?",
    "respuesta": "A la Agencia Estatal de Meteorología",
    "fuente": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.A). BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A4",
    "localizacion": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.A)",
    "apartado": "Fases y situaciones"
  },
  {
    "id": "CPEI-T23-OF-60055403",
    "orden": 120,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿con qué organismos se sigue la evolución hidrológica de los desbordamientos?",
    "respuesta": "Con las diferentes Confederaciones Hidrográficas",
    "fuente": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.A). BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A4",
    "localizacion": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.A)",
    "apartado": "Fases y situaciones"
  },
  {
    "id": "CPEI-T23-OF-B2D2D991",
    "orden": 130,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿qué define la situación 0 de la fase de emergencia?",
    "respuesta": "Las informaciones meteorológicas e hidrológicas permiten prever la inminencia de inundaciones en el ámbito del Plan, con peligro para personas y bienes",
    "fuente": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.B). BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A4",
    "localizacion": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.B)",
    "apartado": "Fases y situaciones"
  },
  {
    "id": "CPEI-T23-OF-6488270B",
    "orden": 140,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿qué define la situación 1?",
    "respuesta": "Se han producido inundaciones en zonas localizadas, cuya atención puede quedar asegurada mediante el empleo de los medios y recursos disponibles en las zonas afectadas",
    "fuente": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.B). BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A4",
    "localizacion": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.B)",
    "apartado": "Fases y situaciones"
  },
  {
    "id": "CPEI-T23-OF-ACB42C66",
    "orden": 150,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿qué define la situación 2?",
    "respuesta": "Se han producido inundaciones que superan la capacidad de atención de los medios y recursos disponibles",
    "fuente": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.B). BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A4",
    "localizacion": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.B)",
    "apartado": "Fases y situaciones"
  },
  {
    "id": "CPEI-T23-OF-A3F66CD8",
    "orden": 160,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿quién declara la situación 3?",
    "respuesta": "El/la Ministro/a de Interior",
    "fuente": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.B). BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A4",
    "localizacion": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.B)",
    "apartado": "Fases y situaciones"
  },
  {
    "id": "CPEI-T23-OF-4C7053A2",
    "orden": 170,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿hasta cuándo se prolonga la fase de normalización?",
    "respuesta": "Hasta el restablecimiento de las condiciones mínimas imprescindibles para el retorno a la normalidad en las zonas afectadas por la inundación",
    "fuente": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.C). BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A4",
    "localizacion": "Plan Estatal de Inundaciones, 4. Fases y situaciones, apdo. 4.C)",
    "apartado": "Fases y situaciones"
  },
  {
    "id": "CPEI-T23-OF-0C35FF39",
    "orden": 180,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿a quién corresponde la declaración de interés nacional de una emergencia por inundaciones?",
    "respuesta": "Al o a la Ministro/a del Interior",
    "fuente": "Plan Estatal de Inundaciones, 5. Organización, apdo. 5. BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A5",
    "localizacion": "Plan Estatal de Inundaciones, 5. Organización, apdo. 5",
    "apartado": "Organización"
  },
  {
    "id": "CPEI-T23-OF-5A45E1BC",
    "orden": 190,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿quién preside el Consejo de Dirección del Plan Estatal?",
    "respuesta": "Ministro/a del Interior",
    "fuente": "Plan Estatal de Inundaciones, 5. Organización, apdo. 5.1.1. BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A5",
    "localizacion": "Plan Estatal de Inundaciones, 5. Organización, apdo. 5.1.1",
    "apartado": "Organización"
  },
  {
    "id": "CPEI-T23-OF-9A169C5D",
    "orden": 200,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿quién ejerce la vicepresidencia del Consejo de Dirección del Plan Estatal?",
    "respuesta": "Subsecretario/a del Interior",
    "fuente": "Plan Estatal de Inundaciones, 5. Organización, apdo. 5.1.1. BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A5",
    "localizacion": "Plan Estatal de Inundaciones, 5. Organización, apdo. 5.1.1",
    "apartado": "Organización"
  },
  {
    "id": "CPEI-T23-OF-81BA774E",
    "orden": 210,
    "concepto": "Según el Plan Estatal de Protección Civil ante el Riesgo de Inundaciones, ¿a quién corresponde la Dirección Operativa de las emergencias declaradas de interés nacional?",
    "respuesta": "A la persona que ocupa el cargo de General Jefe de la Unidad Militar de Emergencias",
    "fuente": "Plan Estatal de Inundaciones, 5. Organización, apdo. 5.2. BOE-A-2011-14277, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2011-14277#A5",
    "localizacion": "Plan Estatal de Inundaciones, 5. Organización, apdo. 5.2",
    "apartado": "Organización"
  }
];
