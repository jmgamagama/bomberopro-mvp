/** Tema 6 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (BOE-A-1995-24292). Calidad: data/tema06/tema06_calidad.md. */

export type Tema6RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA6_RECALL_META = {
  "tema": 6,
  "title": "Tema 6 · Ley 31/1995 de Prevención de Riesgos Laborales",
  "count": 94,
  "source": "Fase 2 · texto consolidado BOE-A-1995-24292 (caps. I-IV, arts. 1-32 bis; últ. act. 09/04/2026)"
} as const;

export const TEMA6_RECALL_CARDS: Tema6RecallCard[] = [
  {
    "id": "CPEI-T06-OF-60B2F4FA",
    "orden": 10,
    "concepto": "Según el art. 1 LPRL, ¿qué normas constituyen la normativa sobre prevención de riesgos laborales?",
    "respuesta": "La presente Ley, sus disposiciones de desarrollo o complementarias y cuantas otras normas, legales o convencionales, contengan prescripciones relativas a la adopción de medidas preventivas en el ámbito laboral",
    "fuente": "Ley 31/1995 (LPRL), Artículo 1. Normativa sobre prevención de riesgos laborales. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a1",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 1. Normativa sobre prevención de riesgos laborales",
    "apartado": "Objeto"
  },
  {
    "id": "CPEI-T06-OF-5F9A31CB",
    "orden": 20,
    "concepto": "Según el art. 2.1 LPRL, ¿qué objeto tiene la Ley de Prevención de Riesgos Laborales?",
    "respuesta": "Promover la seguridad y la salud de los trabajadores mediante la aplicación de medidas y el desarrollo de las actividades necesarias para la prevención de riesgos derivados del trabajo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 2. Objeto y carácter de la norma, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a2",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 2. Objeto y carácter de la norma, apdo. 1",
    "apartado": "Objeto"
  },
  {
    "id": "CPEI-T06-OF-5542447C",
    "orden": 30,
    "concepto": "Según el art. 2.2 LPRL, ¿qué carácter tienen sus disposiciones de carácter laboral?",
    "respuesta": "El carácter de Derecho necesario mínimo indisponible",
    "fuente": "Ley 31/1995 (LPRL), Artículo 2. Objeto y carácter de la norma, apdo. 2. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a2",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 2. Objeto y carácter de la norma, apdo. 2",
    "apartado": "Objeto"
  },
  {
    "id": "CPEI-T06-OF-2CBD5F40",
    "orden": 40,
    "concepto": "Según el art. 2.2 LPRL, ¿dónde pueden ser mejoradas y desarrolladas sus disposiciones laborales?",
    "respuesta": "En los convenios colectivos",
    "fuente": "Ley 31/1995 (LPRL), Artículo 2. Objeto y carácter de la norma, apdo. 2. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a2",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 2. Objeto y carácter de la norma, apdo. 2",
    "apartado": "Objeto"
  },
  {
    "id": "CPEI-T06-OF-BD38A4C7",
    "orden": 50,
    "concepto": "Según el art. 3.1 LPRL, además de las relaciones laborales, ¿a qué relaciones del personal de las Administraciones Públicas se aplica la Ley?",
    "respuesta": "A las relaciones de carácter administrativo o estatutario del personal al servicio de las Administraciones Públicas",
    "fuente": "Ley 31/1995 (LPRL), Artículo 3. Ambito de aplicación, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a3",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 3. Ambito de aplicación, apdo. 1",
    "apartado": "Ámbito de aplicación"
  },
  {
    "id": "CPEI-T06-OF-E92E8E8A",
    "orden": 60,
    "concepto": "Según el art. 3.2 LPRL, ¿en qué funciones públicas de protección civil no se aplica la Ley cuando sus particularidades lo impidan?",
    "respuesta": "Servicios operativos de protección civil y peritaje forense en los casos de grave riesgo, catástrofe y calamidad pública",
    "fuente": "Ley 31/1995 (LPRL), Artículo 3. Ambito de aplicación, apdo. 2. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a3",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 3. Ambito de aplicación, apdo. 2",
    "apartado": "Ámbito de aplicación"
  },
  {
    "id": "CPEI-T06-OF-99EC02AC",
    "orden": 70,
    "concepto": "Según el art. 3.2 LPRL, ¿qué tres ámbitos de funciones públicas quedan excluidos cuando sus particularidades lo impidan?",
    "respuesta": "Policía, seguridad y resguardo aduanero; servicios operativos de protección civil y peritaje forense en los casos de grave riesgo, catástrofe y calamidad pública; Fuerzas Armadas y actividades militares de la Guardia Civil",
    "fuente": "Ley 31/1995 (LPRL), Artículo 3. Ambito de aplicación, apdo. 2. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a3",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 3. Ambito de aplicación, apdo. 2",
    "apartado": "Ámbito de aplicación"
  },
  {
    "id": "CPEI-T06-OF-C4F41FFC",
    "orden": 80,
    "concepto": "Según el art. 3.2 LPRL, ¿qué papel tiene la Ley respecto de la normativa específica de las actividades excluidas?",
    "respuesta": "Esta Ley inspirará la normativa específica que se dicte para regular la protección de la seguridad y la salud de los trabajadores que prestan sus servicios en las indicadas actividades",
    "fuente": "Ley 31/1995 (LPRL), Artículo 3. Ambito de aplicación, apdo. 2. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a3",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 3. Ambito de aplicación, apdo. 2",
    "apartado": "Ámbito de aplicación"
  },
  {
    "id": "CPEI-T06-OF-2C3FDCE6",
    "orden": 90,
    "concepto": "Según el art. 4 LPRL, ¿qué se entiende por «prevención»?",
    "respuesta": "El conjunto de actividades o medidas adoptadas o previstas en todas las fases de actividad de la empresa con el fin de evitar o disminuir los riesgos derivados del trabajo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 1.º. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a4",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 1.º",
    "apartado": "Definiciones"
  },
  {
    "id": "CPEI-T06-OF-3952AB0B",
    "orden": 100,
    "concepto": "Según el art. 4 LPRL, ¿qué se entiende por «riesgo laboral»?",
    "respuesta": "La posibilidad de que un trabajador sufra un determinado daño derivado del trabajo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 2.º. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a4",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 2.º",
    "apartado": "Definiciones"
  },
  {
    "id": "CPEI-T06-OF-18825169",
    "orden": 110,
    "concepto": "Según el art. 4 LPRL, ¿qué dos factores se valoran conjuntamente para calificar la gravedad de un riesgo?",
    "respuesta": "La probabilidad de que se produzca el daño y la severidad del mismo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 2.º. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a4",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 2.º",
    "apartado": "Definiciones"
  },
  {
    "id": "CPEI-T06-OF-8D407847",
    "orden": 120,
    "concepto": "Según el art. 4 LPRL, ¿qué se considera «daños derivados del trabajo»?",
    "respuesta": "Las enfermedades, patologías o lesiones sufridas con motivo u ocasión del trabajo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 3.º. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a4",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 3.º",
    "apartado": "Definiciones"
  },
  {
    "id": "CPEI-T06-OF-14EFBC5A",
    "orden": 130,
    "concepto": "Según el art. 4 LPRL, ¿qué es un «riesgo laboral grave e inminente»?",
    "respuesta": "Aquel que resulte probable racionalmente que se materialice en un futuro inmediato y pueda suponer un daño grave para la salud de los trabajadores",
    "fuente": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 4.º. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a4",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 4.º",
    "apartado": "Definiciones"
  },
  {
    "id": "CPEI-T06-OF-175DF81E",
    "orden": 140,
    "concepto": "Según el art. 4 LPRL, ¿qué procesos, actividades o equipos se consideran «potencialmente peligrosos»?",
    "respuesta": "Aquellos que, en ausencia de medidas preventivas específicas, originen riesgos para la seguridad y la salud de los trabajadores que los desarrollan o utilizan",
    "fuente": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 5.º. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a4",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 5.º",
    "apartado": "Definiciones"
  },
  {
    "id": "CPEI-T06-OF-86FAEF45",
    "orden": 150,
    "concepto": "Según el art. 4 LPRL, ¿qué se entiende como «equipo de trabajo»?",
    "respuesta": "Cualquier máquina, aparato, instrumento o instalación utilizada en el trabajo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 6.º. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a4",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 6.º",
    "apartado": "Definiciones"
  },
  {
    "id": "CPEI-T06-OF-854C429B",
    "orden": 160,
    "concepto": "Según el art. 4 LPRL, ¿qué es una «condición de trabajo»?",
    "respuesta": "Cualquier característica del mismo que pueda tener una influencia significativa en la generación de riesgos para la seguridad y la salud del trabajador",
    "fuente": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 7.º. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a4",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 7.º",
    "apartado": "Definiciones"
  },
  {
    "id": "CPEI-T06-OF-158C8556",
    "orden": 170,
    "concepto": "Según el art. 4 LPRL, ¿qué es un «equipo de protección individual»?",
    "respuesta": "Cualquier equipo destinado a ser llevado o sujetado por el trabajador para que le proteja de uno o varios riesgos que puedan amenazar su seguridad o su salud en el trabajo, así como cualquier complemento o accesorio destinado a tal fin",
    "fuente": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 8.º. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a4",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 4. Definiciones, 8.º",
    "apartado": "Definiciones"
  },
  {
    "id": "CPEI-T06-OF-2F6D6CAF",
    "orden": 180,
    "concepto": "Según el art. 5.1 LPRL, ¿qué objeto tiene la política en materia de prevención?",
    "respuesta": "La promoción de la mejora de las condiciones de trabajo dirigida a elevar el nivel de protección de la seguridad y la salud de los trabajadores en el trabajo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 5. Objetivos de la política, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a5",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 5. Objetivos de la política, apdo. 1",
    "apartado": "Política preventiva"
  },
  {
    "id": "CPEI-T06-OF-FA192793",
    "orden": 190,
    "concepto": "Según el art. 5.1.b) LPRL, ¿con la participación de quién se elabora la política preventiva?",
    "respuesta": "De los empresarios y de los trabajadores a través de sus organizaciones empresariales y sindicales más representativas",
    "fuente": "Ley 31/1995 (LPRL), Artículo 5. Objetivos de la política, apdo. 1.b. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a5",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 5. Objetivos de la política, apdo. 1.b",
    "apartado": "Política preventiva"
  },
  {
    "id": "CPEI-T06-OF-7BB67131",
    "orden": 200,
    "concepto": "Según el art. 5.3 LPRL, ¿a qué empresas se destinarán especialmente los incentivos de los programas de mejora del ambiente de trabajo?",
    "respuesta": "A las pequeñas y medianas empresas",
    "fuente": "Ley 31/1995 (LPRL), Artículo 5. Objetivos de la política, apdo. 3. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a5",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 5. Objetivos de la política, apdo. 3",
    "apartado": "Política preventiva"
  },
  {
    "id": "CPEI-T06-OF-FC9CE506",
    "orden": 210,
    "concepto": "Según el art. 5.5 LPRL, ¿qué integración debe promover la política de prevención de riesgos laborales?",
    "respuesta": "La integración eficaz de la prevención de riesgos laborales en el sistema de gestión de la empresa",
    "fuente": "Ley 31/1995 (LPRL), Artículo 5. Objetivos de la política, apdo. 5. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a5",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 5. Objetivos de la política, apdo. 5",
    "apartado": "Política preventiva"
  },
  {
    "id": "CPEI-T06-OF-1F72B1BF",
    "orden": 220,
    "concepto": "Según el art. 6.1 LPRL, ¿qué consulta previa requiere el Gobierno para dictar las normas reglamentarias de prevención?",
    "respuesta": "Previa consulta a las organizaciones sindicales y empresariales más representativas",
    "fuente": "Ley 31/1995 (LPRL), Artículo 6. Normas reglamentarias, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a6",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 6. Normas reglamentarias, apdo. 1",
    "apartado": "Normas reglamentarias"
  },
  {
    "id": "CPEI-T06-OF-9931AC44",
    "orden": 230,
    "concepto": "Según el art. 7.1 LPRL, ¿qué funciones desarrollan las Administraciones públicas competentes en materia laboral?",
    "respuesta": "Funciones de promoción de la prevención, asesoramiento técnico, vigilancia y control",
    "fuente": "Ley 31/1995 (LPRL), Artículo 7. Actuaciones de las Administraciones públicas competentes en materia laboral, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a7",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 7. Actuaciones de las Administraciones públicas competentes en materia laboral, apdo. 1",
    "apartado": "Administraciones laborales"
  },
  {
    "id": "CPEI-T06-OF-2C69F343",
    "orden": 240,
    "concepto": "Según el art. 8.1 LPRL, ¿qué es el Instituto Nacional de Seguridad e Higiene en el Trabajo?",
    "respuesta": "El órgano científico técnico especializado de la Administración General del Estado",
    "fuente": "Ley 31/1995 (LPRL), Artículo 8. Instituto Nacional de Seguridad e Higiene en el Trabajo, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a8",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 8. Instituto Nacional de Seguridad e Higiene en el Trabajo, apdo. 1",
    "apartado": "INSHT"
  },
  {
    "id": "CPEI-T06-OF-0866D9B2",
    "orden": 250,
    "concepto": "Según el art. 8.1 LPRL, ¿qué misión tiene el Instituto Nacional de Seguridad e Higiene en el Trabajo?",
    "respuesta": "El análisis y estudio de las condiciones de seguridad y salud en el trabajo, así como la promoción y apoyo a la mejora de las mismas",
    "fuente": "Ley 31/1995 (LPRL), Artículo 8. Instituto Nacional de Seguridad e Higiene en el Trabajo, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a8",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 8. Instituto Nacional de Seguridad e Higiene en el Trabajo, apdo. 1",
    "apartado": "INSHT"
  },
  {
    "id": "CPEI-T06-OF-A7447EAC",
    "orden": 260,
    "concepto": "Según el art. 8.3 LPRL, ¿cómo actúa el INSHT en relación con las Instituciones de la Unión Europea?",
    "respuesta": "Como centro de referencia nacional",
    "fuente": "Ley 31/1995 (LPRL), Artículo 8. Instituto Nacional de Seguridad e Higiene en el Trabajo, apdo. 3. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a8",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 8. Instituto Nacional de Seguridad e Higiene en el Trabajo, apdo. 3",
    "apartado": "INSHT"
  },
  {
    "id": "CPEI-T06-OF-0A708D5C",
    "orden": 270,
    "concepto": "Según el art. 8.4 LPRL, ¿qué Secretaría ejerce el Instituto Nacional de Seguridad e Higiene en el Trabajo?",
    "respuesta": "La Secretaría General de la Comisión Nacional de Seguridad y Salud en el Trabajo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 8. Instituto Nacional de Seguridad e Higiene en el Trabajo, apdo. 4. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a8",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 8. Instituto Nacional de Seguridad e Higiene en el Trabajo, apdo. 4",
    "apartado": "INSHT"
  },
  {
    "id": "CPEI-T06-OF-2102DB24",
    "orden": 280,
    "concepto": "Según el art. 9.1 LPRL, ¿a quién corresponde la función de vigilancia y control de la normativa sobre prevención de riesgos laborales?",
    "respuesta": "A la Inspección de Trabajo y Seguridad Social",
    "fuente": "Ley 31/1995 (LPRL), Artículo 9. Inspección de Trabajo y Seguridad Social, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a9",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 9. Inspección de Trabajo y Seguridad Social, apdo. 1",
    "apartado": "Inspección de Trabajo"
  },
  {
    "id": "CPEI-T06-OF-418E0CE1",
    "orden": 290,
    "concepto": "Según el art. 9.1.f) LPRL, ¿qué puede ordenar la Inspección de Trabajo ante un riesgo grave e inminente?",
    "respuesta": "La paralización inmediata de trabajos",
    "fuente": "Ley 31/1995 (LPRL), Artículo 9. Inspección de Trabajo y Seguridad Social, apdo. 1.f. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a9",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 9. Inspección de Trabajo y Seguridad Social, apdo. 1.f",
    "apartado": "Inspección de Trabajo"
  },
  {
    "id": "CPEI-T06-OF-4E68616D",
    "orden": 300,
    "concepto": "Según el art. 9.1.c) LPRL, ¿para qué órganos judiciales elabora informes la Inspección de Trabajo en procedimientos de accidentes de trabajo?",
    "respuesta": "Los Juzgados de lo Social",
    "fuente": "Ley 31/1995 (LPRL), Artículo 9. Inspección de Trabajo y Seguridad Social, apdo. 1.c. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a9",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 9. Inspección de Trabajo y Seguridad Social, apdo. 1.c",
    "apartado": "Inspección de Trabajo"
  },
  {
    "id": "CPEI-T06-OF-B9279B03",
    "orden": 310,
    "concepto": "Según el art. 12 LPRL, ¿qué constituye principio básico de la política de prevención de riesgos laborales?",
    "respuesta": "La participación de empresarios y trabajadores, a través de las organizaciones empresariales y sindicales más representativas",
    "fuente": "Ley 31/1995 (LPRL), Artículo 12. Participación de empresarios y trabajadores. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a12",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 12. Participación de empresarios y trabajadores",
    "apartado": "Participación"
  },
  {
    "id": "CPEI-T06-OF-5E3439F5",
    "orden": 320,
    "concepto": "Según el art. 13.1 LPRL, ¿qué naturaleza tiene la Comisión Nacional de Seguridad y Salud en el Trabajo?",
    "respuesta": "Órgano colegiado asesor de las Administraciones públicas en la formulación de las políticas de prevención y órgano de participación institucional en materia de seguridad y salud en el trabajo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 13. Comisión Nacional de Seguridad y Salud en el Trabajo, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a13",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 13. Comisión Nacional de Seguridad y Salud en el Trabajo, apdo. 1",
    "apartado": "CNSST"
  },
  {
    "id": "CPEI-T06-OF-AD273750",
    "orden": 330,
    "concepto": "Según el art. 13.2 LPRL, ¿cómo está integrada la Comisión Nacional de Seguridad y Salud en el Trabajo?",
    "respuesta": "Por un representante de cada una de las Comunidades Autónomas y por igual número de miembros de la Administración General del Estado y, paritariamente con todos los anteriores, por representantes de las organizaciones empresariales y sindicales más representativas",
    "fuente": "Ley 31/1995 (LPRL), Artículo 13. Comisión Nacional de Seguridad y Salud en el Trabajo, apdo. 2. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a13",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 13. Comisión Nacional de Seguridad y Salud en el Trabajo, apdo. 2",
    "apartado": "CNSST"
  },
  {
    "id": "CPEI-T06-OF-45FB6460",
    "orden": 340,
    "concepto": "Según el art. 13.4 LPRL, ¿cómo adopta sus acuerdos la Comisión Nacional de Seguridad y Salud en el Trabajo?",
    "respuesta": "Por mayoría",
    "fuente": "Ley 31/1995 (LPRL), Artículo 13. Comisión Nacional de Seguridad y Salud en el Trabajo, apdo. 4. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a13",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 13. Comisión Nacional de Seguridad y Salud en el Trabajo, apdo. 4",
    "apartado": "CNSST"
  },
  {
    "id": "CPEI-T06-OF-969739AB",
    "orden": 350,
    "concepto": "Según el art. 13.4 LPRL, en la Comisión Nacional de Seguridad y Salud en el Trabajo, ¿cuántos votos tiene cada representante de las organizaciones empresariales y sindicales?",
    "respuesta": "Dos",
    "fuente": "Ley 31/1995 (LPRL), Artículo 13. Comisión Nacional de Seguridad y Salud en el Trabajo, apdo. 4. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a13",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 13. Comisión Nacional de Seguridad y Salud en el Trabajo, apdo. 4",
    "apartado": "CNSST"
  },
  {
    "id": "CPEI-T06-OF-22D6C2EA",
    "orden": 360,
    "concepto": "Según el art. 13.5 LPRL, ¿cuántos Vicepresidentes tiene la Comisión Nacional de Seguridad y Salud en el Trabajo?",
    "respuesta": "Cuatro Vicepresidentes, uno por cada uno de los grupos que la integran",
    "fuente": "Ley 31/1995 (LPRL), Artículo 13. Comisión Nacional de Seguridad y Salud en el Trabajo, apdo. 5. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a13",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 13. Comisión Nacional de Seguridad y Salud en el Trabajo, apdo. 5",
    "apartado": "CNSST"
  },
  {
    "id": "CPEI-T06-OF-35E76965",
    "orden": 370,
    "concepto": "Según el art. 13.5 LPRL, ¿a quién corresponde la Presidencia de la Comisión Nacional de Seguridad y Salud en el Trabajo?",
    "respuesta": "Al Secretario general de Empleo y Relaciones Laborales",
    "fuente": "Ley 31/1995 (LPRL), Artículo 13. Comisión Nacional de Seguridad y Salud en el Trabajo, apdo. 5. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a13",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 13. Comisión Nacional de Seguridad y Salud en el Trabajo, apdo. 5",
    "apartado": "CNSST"
  },
  {
    "id": "CPEI-T06-OF-1CFEBFA4",
    "orden": 380,
    "concepto": "Según el art. 13.7 LPRL, ¿en qué formas funciona la Comisión Nacional de Seguridad y Salud en el Trabajo?",
    "respuesta": "En Pleno, en Comisión Permanente o en Grupos de Trabajo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 13. Comisión Nacional de Seguridad y Salud en el Trabajo, apdo. 7. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a13",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 13. Comisión Nacional de Seguridad y Salud en el Trabajo, apdo. 7",
    "apartado": "CNSST"
  },
  {
    "id": "CPEI-T06-OF-962C945F",
    "orden": 390,
    "concepto": "Según el art. 14.1 LPRL, ¿a qué tienen derecho los trabajadores en materia de seguridad y salud en el trabajo?",
    "respuesta": "A una protección eficaz",
    "fuente": "Ley 31/1995 (LPRL), Artículo 14. Derecho a la protección frente a los riesgos laborales, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a14",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 14. Derecho a la protección frente a los riesgos laborales, apdo. 1",
    "apartado": "Derechos y obligaciones"
  },
  {
    "id": "CPEI-T06-OF-7203C845",
    "orden": 400,
    "concepto": "Según el art. 14.1 LPRL, ¿qué deber correlativo supone el derecho de los trabajadores a una protección eficaz?",
    "respuesta": "Un correlativo deber del empresario de protección de los trabajadores frente a los riesgos laborales",
    "fuente": "Ley 31/1995 (LPRL), Artículo 14. Derecho a la protección frente a los riesgos laborales, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a14",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 14. Derecho a la protección frente a los riesgos laborales, apdo. 1",
    "apartado": "Derechos y obligaciones"
  },
  {
    "id": "CPEI-T06-OF-13DB1A7E",
    "orden": 410,
    "concepto": "Según el art. 14.5 LPRL, ¿sobre quién no deberá recaer en modo alguno el coste de las medidas de seguridad y salud en el trabajo?",
    "respuesta": "Sobre los trabajadores",
    "fuente": "Ley 31/1995 (LPRL), Artículo 14. Derecho a la protección frente a los riesgos laborales, apdo. 5. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a14",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 14. Derecho a la protección frente a los riesgos laborales, apdo. 5",
    "apartado": "Derechos y obligaciones"
  },
  {
    "id": "CPEI-T06-OF-CB614A80",
    "orden": 420,
    "concepto": "Según el art. 15.1 LPRL, ¿cuáles son los tres primeros principios generales de la acción preventiva?",
    "respuesta": "Evitar los riesgos; evaluar los riesgos que no se puedan evitar; combatir los riesgos en su origen",
    "fuente": "Ley 31/1995 (LPRL), Artículo 15. Principios de la acción preventiva, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a15",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 15. Principios de la acción preventiva, apdo. 1",
    "apartado": "Principios de la acción preventiva"
  },
  {
    "id": "CPEI-T06-OF-4022193F",
    "orden": 430,
    "concepto": "Según el art. 15.1.f) LPRL, ¿qué debe sustituirse como principio de la acción preventiva?",
    "respuesta": "Sustituir lo peligroso por lo que entrañe poco o ningún peligro",
    "fuente": "Ley 31/1995 (LPRL), Artículo 15. Principios de la acción preventiva, apdo. 1.f. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a15",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 15. Principios de la acción preventiva, apdo. 1.f",
    "apartado": "Principios de la acción preventiva"
  },
  {
    "id": "CPEI-T06-OF-B9BC3762",
    "orden": 440,
    "concepto": "Según el art. 15.1.h) LPRL, ¿qué protección debe anteponerse a la individual?",
    "respuesta": "La protección colectiva",
    "fuente": "Ley 31/1995 (LPRL), Artículo 15. Principios de la acción preventiva, apdo. 1.h. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a15",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 15. Principios de la acción preventiva, apdo. 1.h",
    "apartado": "Principios de la acción preventiva"
  },
  {
    "id": "CPEI-T06-OF-A26986E9",
    "orden": 450,
    "concepto": "Según el art. 15.3 LPRL, ¿qué trabajadores pueden acceder a las zonas de riesgo grave y específico?",
    "respuesta": "Sólo los trabajadores que hayan recibido información suficiente y adecuada",
    "fuente": "Ley 31/1995 (LPRL), Artículo 15. Principios de la acción preventiva, apdo. 3. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a15",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 15. Principios de la acción preventiva, apdo. 3",
    "apartado": "Principios de la acción preventiva"
  },
  {
    "id": "CPEI-T06-OF-2280FEF2",
    "orden": 460,
    "concepto": "Según el art. 15.4 LPRL, ¿qué conductas del trabajador debe prever la efectividad de las medidas preventivas?",
    "respuesta": "Las distracciones o imprudencias no temerarias que pudiera cometer el trabajador",
    "fuente": "Ley 31/1995 (LPRL), Artículo 15. Principios de la acción preventiva, apdo. 4. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a15",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 15. Principios de la acción preventiva, apdo. 4",
    "apartado": "Principios de la acción preventiva"
  },
  {
    "id": "CPEI-T06-OF-640C4E4C",
    "orden": 470,
    "concepto": "Según el art. 16.1 LPRL, ¿en qué sistema debe integrarse la prevención de riesgos laborales?",
    "respuesta": "En el sistema general de gestión de la empresa",
    "fuente": "Ley 31/1995 (LPRL), Artículo 16. Plan de prevención de riesgos laborales, evaluación de los riesgos y planificación de la actividad preventiva, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a16",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 16. Plan de prevención de riesgos laborales, evaluación de los riesgos y planificación de la actividad preventiva, apdo. 1",
    "apartado": "Plan de prevención"
  },
  {
    "id": "CPEI-T06-OF-6EAD9114",
    "orden": 480,
    "concepto": "Según el art. 16.2 LPRL, ¿cuáles son los instrumentos esenciales para la gestión y aplicación del plan de prevención?",
    "respuesta": "La evaluación de riesgos laborales y la planificación de la actividad preventiva",
    "fuente": "Ley 31/1995 (LPRL), Artículo 16. Plan de prevención de riesgos laborales, evaluación de los riesgos y planificación de la actividad preventiva, apdo. 2. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a16",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 16. Plan de prevención de riesgos laborales, evaluación de los riesgos y planificación de la actividad preventiva, apdo. 2",
    "apartado": "Plan de prevención"
  },
  {
    "id": "CPEI-T06-OF-B01EE59B",
    "orden": 490,
    "concepto": "Según el art. 16.2.a) LPRL, ¿cuándo será actualizada la evaluación de riesgos?",
    "respuesta": "Cuando cambien las condiciones de trabajo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 16. Plan de prevención de riesgos laborales, evaluación de los riesgos y planificación de la actividad preventiva, apdo. 2.a. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a16",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 16. Plan de prevención de riesgos laborales, evaluación de los riesgos y planificación de la actividad preventiva, apdo. 2.a",
    "apartado": "Evaluación de riesgos"
  },
  {
    "id": "CPEI-T06-OF-94C3BA45",
    "orden": 500,
    "concepto": "Según el art. 16.2.b) LPRL, ¿qué debe incluir la planificación para cada actividad preventiva?",
    "respuesta": "El plazo para llevarla a cabo, la designación de responsables y los recursos humanos y materiales necesarios para su ejecución",
    "fuente": "Ley 31/1995 (LPRL), Artículo 16. Plan de prevención de riesgos laborales, evaluación de los riesgos y planificación de la actividad preventiva, apdo. 2.b. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a16",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 16. Plan de prevención de riesgos laborales, evaluación de los riesgos y planificación de la actividad preventiva, apdo. 2.b",
    "apartado": "Planificación preventiva"
  },
  {
    "id": "CPEI-T06-OF-D06BCE18",
    "orden": 510,
    "concepto": "Según el art. 16.3 LPRL, ¿qué debe llevar a cabo el empresario cuando se haya producido un daño para la salud de los trabajadores?",
    "respuesta": "Una investigación al respecto, a fin de detectar las causas de estos hechos",
    "fuente": "Ley 31/1995 (LPRL), Artículo 16. Plan de prevención de riesgos laborales, evaluación de los riesgos y planificación de la actividad preventiva, apdo. 3. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a16",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 16. Plan de prevención de riesgos laborales, evaluación de los riesgos y planificación de la actividad preventiva, apdo. 3",
    "apartado": "Evaluación de riesgos"
  },
  {
    "id": "CPEI-T06-OF-AEB73C7E",
    "orden": 520,
    "concepto": "Según el art. 17.2 LPRL, ¿cuándo deberán utilizarse los equipos de protección individual?",
    "respuesta": "Cuando los riesgos no se puedan evitar o no puedan limitarse suficientemente por medios técnicos de protección colectiva o mediante medidas, métodos o procedimientos de organización del trabajo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 17. Equipos de trabajo y medios de protección, apdo. 2. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a17",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 17. Equipos de trabajo y medios de protección, apdo. 2",
    "apartado": "Equipos de trabajo y EPI"
  },
  {
    "id": "CPEI-T06-OF-AD7F9620",
    "orden": 530,
    "concepto": "Según el art. 17.1.b) LPRL, ¿por quién deben realizarse los trabajos de reparación o mantenimiento de equipos con riesgo específico?",
    "respuesta": "Por los trabajadores específicamente capacitados para ello",
    "fuente": "Ley 31/1995 (LPRL), Artículo 17. Equipos de trabajo y medios de protección, apdo. 1.b. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a17",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 17. Equipos de trabajo y medios de protección, apdo. 1.b",
    "apartado": "Equipos de trabajo y EPI"
  },
  {
    "id": "CPEI-T06-OF-C8BB5081",
    "orden": 540,
    "concepto": "Según el art. 18.1 LPRL, en las empresas con representantes de los trabajadores, ¿de qué riesgos debe informarse directamente a cada trabajador?",
    "respuesta": "De los riesgos específicos que afecten a su puesto de trabajo o función y de las medidas de protección y prevención aplicables a dichos riesgos",
    "fuente": "Ley 31/1995 (LPRL), Artículo 18. Información, consulta y participación de los trabajadores, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a18",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 18. Información, consulta y participación de los trabajadores, apdo. 1",
    "apartado": "Información y consulta"
  },
  {
    "id": "CPEI-T06-OF-C5ACA02F",
    "orden": 550,
    "concepto": "Según el art. 19.1 LPRL, ¿qué formación en materia preventiva debe garantizar el empresario a cada trabajador?",
    "respuesta": "Una formación teórica y práctica, suficiente y adecuada",
    "fuente": "Ley 31/1995 (LPRL), Artículo 19. Formación de los trabajadores, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a19",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 19. Formación de los trabajadores, apdo. 1",
    "apartado": "Formación"
  },
  {
    "id": "CPEI-T06-OF-72DFC297",
    "orden": 560,
    "concepto": "Según el art. 19.1 LPRL, ¿en qué momentos debe impartirse la formación preventiva al trabajador?",
    "respuesta": "En el momento de su contratación, cualquiera que sea la modalidad o duración de ésta, como cuando se produzcan cambios en las funciones que desempeñe o se introduzcan nuevas tecnologías o cambios en los equipos de trabajo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 19. Formación de los trabajadores, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a19",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 19. Formación de los trabajadores, apdo. 1",
    "apartado": "Formación"
  },
  {
    "id": "CPEI-T06-OF-CB264D3D",
    "orden": 570,
    "concepto": "Según el art. 19.2 LPRL, ¿cuándo debe impartirse, siempre que sea posible, la formación preventiva?",
    "respuesta": "Dentro de la jornada de trabajo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 19. Formación de los trabajadores, apdo. 2. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a19",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 19. Formación de los trabajadores, apdo. 2",
    "apartado": "Formación"
  },
  {
    "id": "CPEI-T06-OF-D8F6418A",
    "orden": 580,
    "concepto": "Según el art. 20 LPRL, ¿en qué materias debe adoptar medidas el empresario ante posibles situaciones de emergencia?",
    "respuesta": "Primeros auxilios, lucha contra incendios y evacuación de los trabajadores",
    "fuente": "Ley 31/1995 (LPRL), Artículo 20. Medidas de emergencia. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a20",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 20. Medidas de emergencia",
    "apartado": "Medidas de emergencia"
  },
  {
    "id": "CPEI-T06-OF-1A3026DA",
    "orden": 590,
    "concepto": "Según el art. 20 LPRL, ¿qué requisitos debe cumplir el personal encargado de las medidas de emergencia?",
    "respuesta": "Poseer la formación necesaria, ser suficiente en número y disponer del material adecuado",
    "fuente": "Ley 31/1995 (LPRL), Artículo 20. Medidas de emergencia. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a20",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 20. Medidas de emergencia",
    "apartado": "Medidas de emergencia"
  },
  {
    "id": "CPEI-T06-OF-331E16F4",
    "orden": 600,
    "concepto": "Según el art. 21.2 LPRL, ¿qué derecho tiene el trabajador cuando considere que su actividad entraña un riesgo grave e inminente para su vida o su salud?",
    "respuesta": "Derecho a interrumpir su actividad y abandonar el lugar de trabajo, en caso necesario",
    "fuente": "Ley 31/1995 (LPRL), Artículo 21. Riesgo grave e inminente, apdo. 2. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a21",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 21. Riesgo grave e inminente, apdo. 2",
    "apartado": "Riesgo grave e inminente"
  },
  {
    "id": "CPEI-T06-OF-4AAEB0A7",
    "orden": 610,
    "concepto": "Según el art. 21.3 LPRL, ¿cómo pueden acordar los representantes legales de los trabajadores la paralización de la actividad?",
    "respuesta": "Por mayoría de sus miembros",
    "fuente": "Ley 31/1995 (LPRL), Artículo 21. Riesgo grave e inminente, apdo. 3. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a21",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 21. Riesgo grave e inminente, apdo. 3",
    "apartado": "Riesgo grave e inminente"
  },
  {
    "id": "CPEI-T06-OF-4B229D23",
    "orden": 620,
    "concepto": "Según el art. 21.3 LPRL, ¿en qué plazo debe la autoridad laboral anular o ratificar la paralización acordada por los representantes?",
    "respuesta": "En el plazo de veinticuatro horas",
    "fuente": "Ley 31/1995 (LPRL), Artículo 21. Riesgo grave e inminente, apdo. 3. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a21",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 21. Riesgo grave e inminente, apdo. 3",
    "apartado": "Riesgo grave e inminente"
  },
  {
    "id": "CPEI-T06-OF-72935ED4",
    "orden": 630,
    "concepto": "Según el art. 21.4 LPRL, ¿en qué casos pueden sufrir perjuicio los trabajadores o representantes que paralizan la actividad?",
    "respuesta": "Si hubieran obrado de mala fe o cometido negligencia grave",
    "fuente": "Ley 31/1995 (LPRL), Artículo 21. Riesgo grave e inminente, apdo. 4. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a21",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 21. Riesgo grave e inminente, apdo. 4",
    "apartado": "Riesgo grave e inminente"
  },
  {
    "id": "CPEI-T06-OF-B6DA1152",
    "orden": 640,
    "concepto": "Según el art. 22.1 LPRL, ¿qué requisito general exige la vigilancia de la salud del trabajador?",
    "respuesta": "Que el trabajador preste su consentimiento",
    "fuente": "Ley 31/1995 (LPRL), Artículo 22. Vigilancia de la salud, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a22",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 22. Vigilancia de la salud, apdo. 1",
    "apartado": "Vigilancia de la salud"
  },
  {
    "id": "CPEI-T06-OF-7206B6AA",
    "orden": 650,
    "concepto": "Según el art. 22.1 LPRL, ¿qué reconocimientos se deben elegir en la vigilancia de la salud?",
    "respuesta": "Aquellos reconocimientos o pruebas que causen las menores molestias al trabajador y que sean proporcionales al riesgo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 22. Vigilancia de la salud, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a22",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 22. Vigilancia de la salud, apdo. 1",
    "apartado": "Vigilancia de la salud"
  },
  {
    "id": "CPEI-T06-OF-1F81D5D2",
    "orden": 660,
    "concepto": "Según el art. 22.4 LPRL, ¿a quién se limita el acceso a la información médica de carácter personal del trabajador?",
    "respuesta": "Al personal médico y a las autoridades sanitarias que lleven a cabo la vigilancia de la salud de los trabajadores",
    "fuente": "Ley 31/1995 (LPRL), Artículo 22. Vigilancia de la salud, apdo. 4. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a22",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 22. Vigilancia de la salud, apdo. 4",
    "apartado": "Vigilancia de la salud"
  },
  {
    "id": "CPEI-T06-OF-DC7AD5A5",
    "orden": 670,
    "concepto": "Según el art. 22.6 LPRL, ¿por quién se llevarán a cabo las medidas de vigilancia de la salud?",
    "respuesta": "Por personal sanitario con competencia técnica, formación y capacidad acreditada",
    "fuente": "Ley 31/1995 (LPRL), Artículo 22. Vigilancia de la salud, apdo. 6. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a22",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 22. Vigilancia de la salud, apdo. 6",
    "apartado": "Vigilancia de la salud"
  },
  {
    "id": "CPEI-T06-OF-5C790EE5",
    "orden": 680,
    "concepto": "Según el art. 23.1.e) LPRL, ¿qué accidentes y enfermedades deben figurar en la relación documental del empresario?",
    "respuesta": "Los que hayan causado al trabajador una incapacidad laboral superior a un día de trabajo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 23. Documentación, apdo. 1.e. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a23",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 23. Documentación, apdo. 1.e",
    "apartado": "Documentación"
  },
  {
    "id": "CPEI-T06-OF-7662A26F",
    "orden": 690,
    "concepto": "Según el art. 23.2 LPRL, ¿cuándo deben remitir las empresas a la autoridad laboral su documentación preventiva?",
    "respuesta": "En el momento de cesación de su actividad",
    "fuente": "Ley 31/1995 (LPRL), Artículo 23. Documentación, apdo. 2. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a23",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 23. Documentación, apdo. 2",
    "apartado": "Documentación"
  },
  {
    "id": "CPEI-T06-OF-31D8AA6B",
    "orden": 700,
    "concepto": "Según el art. 24.1 LPRL, ¿qué deben hacer las empresas cuyos trabajadores coinciden en un mismo centro de trabajo?",
    "respuesta": "Cooperar en la aplicación de la normativa sobre prevención de riesgos laborales",
    "fuente": "Ley 31/1995 (LPRL), Artículo 24. Coordinación de actividades empresariales, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a24",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 24. Coordinación de actividades empresariales, apdo. 1",
    "apartado": "Coordinación empresarial"
  },
  {
    "id": "CPEI-T06-OF-66B8DBB5",
    "orden": 710,
    "concepto": "Según el art. 25.1 LPRL, ¿qué trabajadores deben ser objeto de protección específica por ser especialmente sensibles?",
    "respuesta": "Los que, por sus propias características personales o estado biológico conocido, incluidos aquellos que tengan reconocida la situación de discapacidad física, psíquica o sensorial, sean especialmente sensibles a los riesgos derivados del trabajo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 25. Protección de trabajadores especialmente sensibles a determinados riesgos, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a25",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 25. Protección de trabajadores especialmente sensibles a determinados riesgos, apdo. 1",
    "apartado": "Trabajadores sensibles"
  },
  {
    "id": "CPEI-T06-OF-97EE2D09",
    "orden": 720,
    "concepto": "Según el art. 26.1 LPRL, ¿qué trabajos pueden excluirse, cuando resulte necesario, para proteger a la trabajadora embarazada?",
    "respuesta": "La no realización de trabajo nocturno o de trabajo a turnos",
    "fuente": "Ley 31/1995 (LPRL), Artículo 26. Protección de la maternidad, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a26",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 26. Protección de la maternidad, apdo. 1",
    "apartado": "Maternidad"
  },
  {
    "id": "CPEI-T06-OF-6C35966A",
    "orden": 730,
    "concepto": "Según el art. 26.4 LPRL, ¿hasta qué edad del hijo puede declararse la suspensión del contrato por riesgo durante la lactancia natural?",
    "respuesta": "De hijos menores de nueve meses",
    "fuente": "Ley 31/1995 (LPRL), Artículo 26. Protección de la maternidad, apdo. 4. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a26",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 26. Protección de la maternidad, apdo. 4",
    "apartado": "Maternidad"
  },
  {
    "id": "CPEI-T06-OF-95491B14",
    "orden": 740,
    "concepto": "Según el art. 26.5 LPRL, ¿para qué pueden ausentarse del trabajo con remuneración las trabajadoras embarazadas?",
    "respuesta": "Para la realización de exámenes prenatales y técnicas de preparación al parto",
    "fuente": "Ley 31/1995 (LPRL), Artículo 26. Protección de la maternidad, apdo. 5. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a26",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 26. Protección de la maternidad, apdo. 5",
    "apartado": "Maternidad"
  },
  {
    "id": "CPEI-T06-OF-1189C989",
    "orden": 750,
    "concepto": "Según el art. 28.5 LPRL, en la cesión por empresa de trabajo temporal, ¿quién es responsable de las condiciones de ejecución del trabajo en materia de seguridad y salud?",
    "respuesta": "La empresa usuaria",
    "fuente": "Ley 31/1995 (LPRL), Artículo 28. Relaciones de trabajo temporales, de duración determinada y en empresas de trabajo temporal, apdo. 5. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a28",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 28. Relaciones de trabajo temporales, de duración determinada y en empresas de trabajo temporal, apdo. 5",
    "apartado": "ETT"
  },
  {
    "id": "CPEI-T06-OF-14C9A04C",
    "orden": 760,
    "concepto": "Según el art. 28.5 LPRL, ¿de qué obligaciones es responsable la empresa de trabajo temporal?",
    "respuesta": "De las obligaciones en materia de formación y vigilancia de la salud",
    "fuente": "Ley 31/1995 (LPRL), Artículo 28. Relaciones de trabajo temporales, de duración determinada y en empresas de trabajo temporal, apdo. 5. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a28",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 28. Relaciones de trabajo temporales, de duración determinada y en empresas de trabajo temporal, apdo. 5",
    "apartado": "ETT"
  },
  {
    "id": "CPEI-T06-OF-35F9AA5D",
    "orden": 770,
    "concepto": "Según el art. 29.1 LPRL, ¿por la seguridad y salud de quién debe velar cada trabajador?",
    "respuesta": "Por su propia seguridad y salud en el trabajo y por la de aquellas otras personas a las que pueda afectar su actividad profesional",
    "fuente": "Ley 31/1995 (LPRL), Artículo 29. Obligaciones de los trabajadores en materia de prevención de riesgos, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a29",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 29. Obligaciones de los trabajadores en materia de prevención de riesgos, apdo. 1",
    "apartado": "Obligaciones de los trabajadores"
  },
  {
    "id": "CPEI-T06-OF-140B32C1",
    "orden": 780,
    "concepto": "Según el art. 29.2 LPRL, ¿qué deben hacer los trabajadores con los dispositivos de seguridad existentes?",
    "respuesta": "No poner fuera de funcionamiento y utilizar correctamente los dispositivos de seguridad",
    "fuente": "Ley 31/1995 (LPRL), Artículo 29. Obligaciones de los trabajadores en materia de prevención de riesgos, apdo. 2.3.º. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a29",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 29. Obligaciones de los trabajadores en materia de prevención de riesgos, apdo. 2.3.º",
    "apartado": "Obligaciones de los trabajadores"
  },
  {
    "id": "CPEI-T06-OF-204727C5",
    "orden": 790,
    "concepto": "Según el art. 29.2 LPRL, ¿a quién debe informar de inmediato el trabajador de una situación de riesgo?",
    "respuesta": "A su superior jerárquico directo, y a los trabajadores designados para realizar actividades de protección y de prevención o, en su caso, al servicio de prevención",
    "fuente": "Ley 31/1995 (LPRL), Artículo 29. Obligaciones de los trabajadores en materia de prevención de riesgos, apdo. 2.4.º. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a29",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 29. Obligaciones de los trabajadores en materia de prevención de riesgos, apdo. 2.4.º",
    "apartado": "Obligaciones de los trabajadores"
  },
  {
    "id": "CPEI-T06-OF-D359026A",
    "orden": 800,
    "concepto": "Según el art. 29.3 LPRL, ¿qué consideración tiene para los funcionarios el incumplimiento de sus obligaciones de prevención?",
    "respuesta": "De falta, en su caso, conforme a lo establecido en la correspondiente normativa sobre régimen disciplinario de los funcionarios públicos",
    "fuente": "Ley 31/1995 (LPRL), Artículo 29. Obligaciones de los trabajadores en materia de prevención de riesgos, apdo. 3. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a29",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 29. Obligaciones de los trabajadores en materia de prevención de riesgos, apdo. 3",
    "apartado": "Obligaciones de los trabajadores"
  },
  {
    "id": "CPEI-T06-OF-F6D07A2F",
    "orden": 810,
    "concepto": "Según el art. 30.1 LPRL, ¿cuáles son las tres opciones del empresario para organizar la actividad preventiva?",
    "respuesta": "Designará uno o varios trabajadores para ocuparse de dicha actividad, constituirá un servicio de prevención o concertará dicho servicio con una entidad especializada ajena a la empresa",
    "fuente": "Ley 31/1995 (LPRL), Artículo 30. Protección y prevención de riesgos profesionales, apdo. 1. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a30",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 30. Protección y prevención de riesgos profesionales, apdo. 1",
    "apartado": "Servicios de prevención"
  },
  {
    "id": "CPEI-T06-OF-9E6A0718",
    "orden": 820,
    "concepto": "Según el art. 30.4 LPRL, ¿qué deben guardar los trabajadores designados sobre la información de la empresa?",
    "respuesta": "Sigilo profesional",
    "fuente": "Ley 31/1995 (LPRL), Artículo 30. Protección y prevención de riesgos profesionales, apdo. 4. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a30",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 30. Protección y prevención de riesgos profesionales, apdo. 4",
    "apartado": "Servicios de prevención"
  },
  {
    "id": "CPEI-T06-OF-8E77924D",
    "orden": 830,
    "concepto": "Según el art. 30.5 LPRL, ¿en las empresas de hasta cuántos trabajadores puede el empresario asumir personalmente la actividad preventiva?",
    "respuesta": "Hasta diez trabajadores",
    "fuente": "Ley 31/1995 (LPRL), Artículo 30. Protección y prevención de riesgos profesionales, apdo. 5. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a30",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 30. Protección y prevención de riesgos profesionales, apdo. 5",
    "apartado": "Servicios de prevención"
  },
  {
    "id": "CPEI-T06-OF-DF4D7CEB",
    "orden": 840,
    "concepto": "Según el art. 30.5 LPRL, ¿hasta cuántos trabajadores puede asumir personalmente la prevención el empresario si la empresa tiene un único centro de trabajo?",
    "respuesta": "Hasta 25 trabajadores",
    "fuente": "Ley 31/1995 (LPRL), Artículo 30. Protección y prevención de riesgos profesionales, apdo. 5. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a30",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 30. Protección y prevención de riesgos profesionales, apdo. 5",
    "apartado": "Servicios de prevención"
  },
  {
    "id": "CPEI-T06-OF-65A6EE35",
    "orden": 850,
    "concepto": "Según el art. 30.6 LPRL, ¿a qué control debe someter su sistema de prevención el empresario que no lo haya concertado con una entidad ajena?",
    "respuesta": "Al control de una auditoría o evaluación externa",
    "fuente": "Ley 31/1995 (LPRL), Artículo 30. Protección y prevención de riesgos profesionales, apdo. 6. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a30",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 30. Protección y prevención de riesgos profesionales, apdo. 6",
    "apartado": "Servicios de prevención"
  },
  {
    "id": "CPEI-T06-OF-EA9F7A9F",
    "orden": 860,
    "concepto": "Según el art. 31.2 LPRL, ¿qué se entiende como servicio de prevención?",
    "respuesta": "El conjunto de medios humanos y materiales necesarios para realizar las actividades preventivas a fin de garantizar la adecuada protección de la seguridad y la salud de los trabajadores",
    "fuente": "Ley 31/1995 (LPRL), Artículo 31. Servicios de prevención, apdo. 2. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a31",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 31. Servicios de prevención, apdo. 2",
    "apartado": "Servicios de prevención"
  },
  {
    "id": "CPEI-T06-OF-E35F7F63",
    "orden": 870,
    "concepto": "Según el art. 31.4 LPRL, ¿qué carácter tiene el servicio de prevención?",
    "respuesta": "Carácter interdisciplinario",
    "fuente": "Ley 31/1995 (LPRL), Artículo 31. Servicios de prevención, apdo. 4. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a31",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 31. Servicios de prevención, apdo. 4",
    "apartado": "Servicios de prevención"
  },
  {
    "id": "CPEI-T06-OF-136C6BA4",
    "orden": 880,
    "concepto": "Según el art. 31.4 LPRL, ¿en función de qué tres circunstancias se dimensionan los medios del servicio de prevención?",
    "respuesta": "Tamaño de la empresa; tipos de riesgo a los que puedan encontrarse expuestos los trabajadores; distribución de riesgos en la empresa",
    "fuente": "Ley 31/1995 (LPRL), Artículo 31. Servicios de prevención, apdo. 4. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a31",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 31. Servicios de prevención, apdo. 4",
    "apartado": "Servicios de prevención"
  },
  {
    "id": "CPEI-T06-OF-E26EFA06",
    "orden": 890,
    "concepto": "Según el art. 31.5 LPRL, ¿qué acreditación necesitan las entidades especializadas para actuar como servicios de prevención?",
    "respuesta": "Una acreditación por la autoridad laboral, que será única y con validez en todo el territorio español",
    "fuente": "Ley 31/1995 (LPRL), Artículo 31. Servicios de prevención, apdo. 5. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a31",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 31. Servicios de prevención, apdo. 5",
    "apartado": "Servicios de prevención"
  },
  {
    "id": "CPEI-T06-OF-622F69E4",
    "orden": 900,
    "concepto": "Según el art. 31.6 LPRL, ¿qué efecto tiene el vencimiento del plazo de acreditación sin resolución expresa?",
    "respuesta": "Permitirá entender desestimada la solicitud por silencio administrativo",
    "fuente": "Ley 31/1995 (LPRL), Artículo 31. Servicios de prevención, apdo. 6. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a31",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 31. Servicios de prevención, apdo. 6",
    "apartado": "Servicios de prevención"
  },
  {
    "id": "CPEI-T06-OF-9B5308FF",
    "orden": 910,
    "concepto": "Según el art. 32 LPRL, ¿qué entidades no pueden desarrollar las funciones de servicios de prevención ajenos?",
    "respuesta": "Las Mutuas Colaboradoras con la Seguridad Social",
    "fuente": "Ley 31/1995 (LPRL), Artículo 32. Prohibición de participación en actividades mercantiles de prevención. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a32",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 32. Prohibición de participación en actividades mercantiles de prevención",
    "apartado": "Servicios de prevención"
  },
  {
    "id": "CPEI-T06-OF-59C893FA",
    "orden": 920,
    "concepto": "Según el art. 32 bis.2 LPRL, ¿qué se consideran recursos preventivos?",
    "respuesta": "Uno o varios trabajadores designados de la empresa; uno o varios miembros del servicio de prevención propio de la empresa; uno o varios miembros del o los servicios de prevención ajenos concertados por la empresa",
    "fuente": "Ley 31/1995 (LPRL), Artículo 32 bis. Presencia de los recursos preventivos, apdo. 2. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a32bis",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 32 bis. Presencia de los recursos preventivos, apdo. 2",
    "apartado": "Recursos preventivos"
  },
  {
    "id": "CPEI-T06-OF-F37A71D5",
    "orden": 930,
    "concepto": "Según el art. 32 bis.3 LPRL, ¿durante cuánto tiempo deben permanecer los recursos preventivos en el centro de trabajo?",
    "respuesta": "Durante el tiempo en que se mantenga la situación que determine su presencia",
    "fuente": "Ley 31/1995 (LPRL), Artículo 32 bis. Presencia de los recursos preventivos, apdo. 3. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a32bis",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 32 bis. Presencia de los recursos preventivos, apdo. 3",
    "apartado": "Recursos preventivos"
  },
  {
    "id": "CPEI-T06-OF-81545148",
    "orden": 940,
    "concepto": "Según el art. 32 bis.4 LPRL, ¿qué formación preventiva mínima deben tener los trabajadores a los que se asigne expresamente la presencia sin ser designados?",
    "respuesta": "La formación preventiva correspondiente, como mínimo, a las funciones del nivel básico",
    "fuente": "Ley 31/1995 (LPRL), Artículo 32 bis. Presencia de los recursos preventivos, apdo. 4. BOE-A-1995-24292, texto consolidado (últ. actualización 09/04/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a32bis",
    "localizacion": "Ley 31/1995 (LPRL), Artículo 32 bis. Presencia de los recursos preventivos, apdo. 4",
    "apartado": "Recursos preventivos"
  }
];
