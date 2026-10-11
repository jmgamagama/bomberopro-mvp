/** Tema 13 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (BOE-A-1997-12735, Reglamento (UE) 2016/425). Calidad: data/tema13/tema13_calidad.md. */

export type Tema13RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA13_RECALL_META = {
  "tema": 13,
  "title": "Tema 13 · Equipos de protección individual: RD 773/1997 y Reglamento (UE) 2016/425",
  "count": 25,
  "source": "Fase 3 · RD 773/1997 (BOE-A-1997-12735, últ. act. 18/12/2025) y Reglamento (UE) 2016/425 (EUR-Lex)"
} as const;

export const TEMA13_RECALL_CARDS: Tema13RecallCard[] = [
  {
    "id": "CPEI-T13-OF-19260B6C",
    "orden": 10,
    "concepto": "Según el RD 773/1997, ¿qué establece este real decreto?",
    "respuesta": "Las disposiciones mínimas de seguridad y de salud para la elección, utilización por los trabajadores en el trabajo y mantenimiento de los equipos de protección individual",
    "fuente": "RD 773/1997, Artículo 1. Objeto, art. 1.1. BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a1",
    "localizacion": "RD 773/1997, Artículo 1. Objeto, art. 1.1",
    "apartado": "Normativa y obligaciones"
  },
  {
    "id": "CPEI-T13-OF-96F710F4",
    "orden": 20,
    "concepto": "Según el RD 773/1997, ¿qué se entiende por «equipo de protección individual»?",
    "respuesta": "Cualquier equipo destinado a ser llevado o sujetado por el trabajador para que le proteja de uno o varios riesgos que puedan amenazar su seguridad o su salud, así como cualquier complemento o accesorio destinado a tal fin",
    "fuente": "RD 773/1997, Artículo 2. Definición de «equipo de protección individual», art. 2.1. BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a2",
    "localizacion": "RD 773/1997, Artículo 2. Definición de «equipo de protección individual», art. 2.1",
    "apartado": "Normativa y obligaciones"
  },
  {
    "id": "CPEI-T13-OF-84E3F7AD",
    "orden": 30,
    "concepto": "Según el RD 773/1997, ¿qué equipos de servicios de emergencia quedan excluidos de la definición de EPI?",
    "respuesta": "Los equipos de los servicios de socorro y salvamento",
    "fuente": "RD 773/1997, Artículo 2. Definición de «equipo de protección individual», art. 2.2.b). BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a2",
    "localizacion": "RD 773/1997, Artículo 2. Definición de «equipo de protección individual», art. 2.2.b)",
    "apartado": "Normativa y obligaciones"
  },
  {
    "id": "CPEI-T13-OF-5531C3B8",
    "orden": 40,
    "concepto": "Según el RD 773/1997, ¿en qué condiciones económicas debe proporcionar el empresario los EPI?",
    "respuesta": "Proporcionar gratuitamente a los trabajadores los equipos de protección individual que deban utilizar, reponiéndolos cuando resulte necesario",
    "fuente": "RD 773/1997, Artículo 3. Obligaciones generales del empresario, art. 3.c). BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a3",
    "localizacion": "RD 773/1997, Artículo 3. Obligaciones generales del empresario, art. 3.c)",
    "apartado": "Normativa y obligaciones"
  },
  {
    "id": "CPEI-T13-OF-BE200732",
    "orden": 50,
    "concepto": "Según el RD 773/1997, ¿cuándo deben utilizarse los EPI?",
    "respuesta": "Cuando existan riesgos para la seguridad o salud de los trabajadores que no hayan podido evitarse o limitarse suficientemente por medios técnicos de protección colectiva o mediante medidas, métodos o procedimientos de organización del trabajo",
    "fuente": "RD 773/1997, Artículo 4. Criterios para el empleo de los equipos de protección individual, art. 4. BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a4",
    "localizacion": "RD 773/1997, Artículo 4. Criterios para el empleo de los equipos de protección individual, art. 4",
    "apartado": "Normativa y obligaciones"
  },
  {
    "id": "CPEI-T13-OF-B2C820AC",
    "orden": 60,
    "concepto": "Según el RD 773/1997, ¿en qué documentación se hará constar la necesidad de utilizar EPI?",
    "respuesta": "En la documentación prevista en el artículo 23 de la Ley de Prevención de Riesgos Laborales",
    "fuente": "RD 773/1997, Artículo 4. Criterios para el empleo de los equipos de protección individual, art. 4. BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a4",
    "localizacion": "RD 773/1997, Artículo 4. Criterios para el empleo de los equipos de protección individual, art. 4",
    "apartado": "Normativa y obligaciones"
  },
  {
    "id": "CPEI-T13-OF-72E8054A",
    "orden": 70,
    "concepto": "Según el RD 773/1997, ¿qué requisito deben cumplir varios EPI utilizados simultáneamente por riesgos múltiples?",
    "respuesta": "Deberán ser compatibles entre sí y mantener su eficacia en relación con el riesgo o riesgos correspondientes",
    "fuente": "RD 773/1997, Artículo 5. Condiciones que deben reunir los equipos de protección individual, art. 5.2. BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a5",
    "localizacion": "RD 773/1997, Artículo 5. Condiciones que deben reunir los equipos de protección individual, art. 5.2",
    "apartado": "Normativa y obligaciones"
  },
  {
    "id": "CPEI-T13-OF-00ECEAF4",
    "orden": 80,
    "concepto": "Según el RD 773/1997, ¿qué anexo contiene el esquema indicativo de riesgos en relación con las partes del cuerpo?",
    "respuesta": "En el anexo I",
    "fuente": "RD 773/1997, Artículo 6. Elección de los equipos de protección individual, art. 6.1.a). BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a6",
    "localizacion": "RD 773/1997, Artículo 6. Elección de los equipos de protección individual, art. 6.1.a)",
    "apartado": "Normativa y obligaciones"
  },
  {
    "id": "CPEI-T13-OF-131ABA8F",
    "orden": 90,
    "concepto": "Según el RD 773/1997, ¿de acuerdo con qué se efectúan la utilización, almacenamiento, mantenimiento, limpieza y reparación de los EPI?",
    "respuesta": "De acuerdo con las instrucciones del fabricante",
    "fuente": "RD 773/1997, Artículo 7. Utilización y mantenimiento de los equipos de protección individual, art. 7.1. BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a7",
    "localizacion": "RD 773/1997, Artículo 7. Utilización y mantenimiento de los equipos de protección individual, art. 7.1",
    "apartado": "Uso y mantenimiento"
  },
  {
    "id": "CPEI-T13-OF-D51203E6",
    "orden": 100,
    "concepto": "Según el RD 773/1997, ¿en función de qué se determina el tiempo durante el cual debe llevarse un EPI?",
    "respuesta": "La gravedad del riesgo; el tiempo o frecuencia de exposición al riesgo; las condiciones del puesto de trabajo; las prestaciones del propio equipo; los riesgos adicionales derivados de la propia utilización del equipo que no hayan podido evitarse",
    "fuente": "RD 773/1997, Artículo 7. Utilización y mantenimiento de los equipos de protección individual, art. 7.2. BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a7",
    "localizacion": "RD 773/1997, Artículo 7. Utilización y mantenimiento de los equipos de protección individual, art. 7.2",
    "apartado": "Uso y mantenimiento"
  },
  {
    "id": "CPEI-T13-OF-092C94F0",
    "orden": 110,
    "concepto": "Según el RD 773/1997, ¿a qué tipo de uso están destinados, en principio, los EPI?",
    "respuesta": "A un uso personal",
    "fuente": "RD 773/1997, Artículo 7. Utilización y mantenimiento de los equipos de protección individual, art. 7.3. BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a7",
    "localizacion": "RD 773/1997, Artículo 7. Utilización y mantenimiento de los equipos de protección individual, art. 7.3",
    "apartado": "Uso y mantenimiento"
  },
  {
    "id": "CPEI-T13-OF-627BB789",
    "orden": 120,
    "concepto": "Según el RD 773/1997, ¿cómo deben proporcionarse preferentemente las instrucciones de uso y mantenimiento de los EPI?",
    "respuesta": "Preferentemente por escrito",
    "fuente": "RD 773/1997, Artículo 8. Obligaciones en materia de información y formación, art. 8.2. BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a8",
    "localizacion": "RD 773/1997, Artículo 8. Obligaciones en materia de información y formación, art. 8.2",
    "apartado": "Uso y mantenimiento"
  },
  {
    "id": "CPEI-T13-OF-2B513ED9",
    "orden": 130,
    "concepto": "Según el RD 773/1997, ¿cuándo organizará el empresario especialmente sesiones de entrenamiento con EPI?",
    "respuesta": "Cuando se requiera la utilización simultánea de varios equipos de protección individual que por su especial complejidad así lo haga necesario",
    "fuente": "RD 773/1997, Artículo 8. Obligaciones en materia de información y formación, art. 8.3. BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a8",
    "localizacion": "RD 773/1997, Artículo 8. Obligaciones en materia de información y formación, art. 8.3",
    "apartado": "Uso y mantenimiento"
  },
  {
    "id": "CPEI-T13-OF-6FF65C8A",
    "orden": 140,
    "concepto": "Según el RD 773/1997, ¿dónde debe colocar el trabajador el EPI después de su utilización?",
    "respuesta": "En el lugar indicado para ello",
    "fuente": "RD 773/1997, Artículo 10. Obligaciones de los trabajadores, art. 10.b). BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a10",
    "localizacion": "RD 773/1997, Artículo 10. Obligaciones de los trabajadores, art. 10.b)",
    "apartado": "Uso y mantenimiento"
  },
  {
    "id": "CPEI-T13-OF-4AC1FB29",
    "orden": 150,
    "concepto": "Según el RD 773/1997, ¿a quién debe informar el trabajador de cualquier defecto o daño apreciado en el EPI?",
    "respuesta": "A su superior jerárquico directo",
    "fuente": "RD 773/1997, Artículo 10. Obligaciones de los trabajadores, art. 10.c). BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#a10",
    "localizacion": "RD 773/1997, Artículo 10. Obligaciones de los trabajadores, art. 10.c)",
    "apartado": "Uso y mantenimiento"
  },
  {
    "id": "CPEI-T13-OF-5EB6C096",
    "orden": 160,
    "concepto": "Según el RD 773/1997, ¿qué organismo elabora la Guía técnica no vinculante sobre utilización de EPI?",
    "respuesta": "El Instituto Nacional de Seguridad e Higiene en el Trabajo",
    "fuente": "RD 773/1997, Disposición final primera. Guía técnica, disp. final 1.ª. BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#dfprimera",
    "localizacion": "RD 773/1997, Disposición final primera. Guía técnica, disp. final 1.ª",
    "apartado": "Uso y mantenimiento"
  },
  {
    "id": "CPEI-T13-OF-26D90139",
    "orden": 170,
    "concepto": "Según el RD 773/1997, ¿qué dos grandes tipos de equipos de protección respiratoria recoge el anexo II además de los de autorrescate y buceo?",
    "respuesta": "Equipos filtrantes; equipos aislantes, incluyendo aquellos con suministro de aire",
    "fuente": "RD 773/1997, anexo II. BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#anii",
    "localizacion": "RD 773/1997, anexo II",
    "apartado": "Tipos de EPI y protección respiratoria"
  },
  {
    "id": "CPEI-T13-OF-00096F95",
    "orden": 180,
    "concepto": "Según el RD 773/1997, ¿contra qué protegen los equipos filtrantes de protección respiratoria?",
    "respuesta": "Partículas, Gases, Partículas y gases, Aerosoles sólidos o líquidos",
    "fuente": "RD 773/1997, anexo II. BOE-A-1997-12735, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-1997-12735#anii",
    "localizacion": "RD 773/1997, anexo II",
    "apartado": "Tipos de EPI y protección respiratoria"
  },
  {
    "id": "CPEI-T13-OF-42142792",
    "orden": 190,
    "concepto": "Según el Reglamento (UE) 2016/425, en la categoría I, ¿hasta qué temperatura de contacto con superficies calientes se considera riesgo mínimo?",
    "respuesta": "Que no excedan de 50 °C",
    "fuente": "Reglamento (UE) 2016/425, CATEGORÍAS DE RIESGOS CON RESPECTO A LOS EPI El presente anexo establece las categorías de riesgo del que el EPI deberá proteger a los usuarios. Categoría I La categoría I incluye exclusivamente los siguientes riesgos mínimos: a) lesiones mecánicas superficiales; b) contacto con materiales de limpieza de acción débil o contacto prolongado con agua; c) contacto con superficies calientes que no excedan de 50 °C; d) lesiones oculares causadas por la luz solar (salvo durante la observación del sol); e) condiciones atmosféricas que no sean de naturaleza extrema. Categoría II La categoría II incluye riesgos distintos de los enumerados en las categorías I y III. Categoría III La categoría III incluye exclusivamente los riesgos que puedan tener consecuencias muy graves, como la muerte o daños irreversibles a la salud, en relación con lo siguiente: a) sustancias y mezclas peligrosas para la salud; b) atmósferas con falta de oxígeno; c) agentes biológicos nocivos; d) radiaciones ionizantes; e) ambientes con altas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de al menos 100 °C; f) ambientes con bajas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de – 50 °C o menos; g) caídas de altura; h) descargas eléctricas y trabajos en tensión; i) ahogamiento; j) cortes por sierras de cadena accionadas a mano; k) chorros de alta presión; l) heridas de bala o arma blanca; m) ruidos nocivos. , anexo I. Reglamento (UE) 2016/425, texto consolidado (últ. actualización DOUE L 81 de 31/03/2016): https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32016R0425#ani",
    "localizacion": "Reglamento (UE) 2016/425, CATEGORÍAS DE RIESGOS CON RESPECTO A LOS EPI El presente anexo establece las categorías de riesgo del que el EPI deberá proteger a los usuarios. Categoría I La categoría I incluye exclusivamente los siguientes riesgos mínimos: a) lesiones mecánicas superficiales; b) contacto con materiales de limpieza de acción débil o contacto prolongado con agua; c) contacto con superficies calientes que no excedan de 50 °C; d) lesiones oculares causadas por la luz solar (salvo durante la observación del sol); e) condiciones atmosféricas que no sean de naturaleza extrema. Categoría II La categoría II incluye riesgos distintos de los enumerados en las categorías I y III. Categoría III La categoría III incluye exclusivamente los riesgos que puedan tener consecuencias muy graves, como la muerte o daños irreversibles a la salud, en relación con lo siguiente: a) sustancias y mezclas peligrosas para la salud; b) atmósferas con falta de oxígeno; c) agentes biológicos nocivos; d) radiaciones ionizantes; e) ambientes con altas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de al menos 100 °C; f) ambientes con bajas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de – 50 °C o menos; g) caídas de altura; h) descargas eléctricas y trabajos en tensión; i) ahogamiento; j) cortes por sierras de cadena accionadas a mano; k) chorros de alta presión; l) heridas de bala o arma blanca; m) ruidos nocivos. , anexo I",
    "apartado": "Clasificación (Reglamento UE)"
  },
  {
    "id": "CPEI-T13-OF-FC205D09",
    "orden": 200,
    "concepto": "Según el Reglamento (UE) 2016/425, ¿qué riesgos incluye la categoría II de EPI?",
    "respuesta": "Riesgos distintos de los enumerados en las categorías I y III",
    "fuente": "Reglamento (UE) 2016/425, CATEGORÍAS DE RIESGOS CON RESPECTO A LOS EPI El presente anexo establece las categorías de riesgo del que el EPI deberá proteger a los usuarios. Categoría I La categoría I incluye exclusivamente los siguientes riesgos mínimos: a) lesiones mecánicas superficiales; b) contacto con materiales de limpieza de acción débil o contacto prolongado con agua; c) contacto con superficies calientes que no excedan de 50 °C; d) lesiones oculares causadas por la luz solar (salvo durante la observación del sol); e) condiciones atmosféricas que no sean de naturaleza extrema. Categoría II La categoría II incluye riesgos distintos de los enumerados en las categorías I y III. Categoría III La categoría III incluye exclusivamente los riesgos que puedan tener consecuencias muy graves, como la muerte o daños irreversibles a la salud, en relación con lo siguiente: a) sustancias y mezclas peligrosas para la salud; b) atmósferas con falta de oxígeno; c) agentes biológicos nocivos; d) radiaciones ionizantes; e) ambientes con altas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de al menos 100 °C; f) ambientes con bajas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de – 50 °C o menos; g) caídas de altura; h) descargas eléctricas y trabajos en tensión; i) ahogamiento; j) cortes por sierras de cadena accionadas a mano; k) chorros de alta presión; l) heridas de bala o arma blanca; m) ruidos nocivos. , anexo I. Reglamento (UE) 2016/425, texto consolidado (últ. actualización DOUE L 81 de 31/03/2016): https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32016R0425#ani",
    "localizacion": "Reglamento (UE) 2016/425, CATEGORÍAS DE RIESGOS CON RESPECTO A LOS EPI El presente anexo establece las categorías de riesgo del que el EPI deberá proteger a los usuarios. Categoría I La categoría I incluye exclusivamente los siguientes riesgos mínimos: a) lesiones mecánicas superficiales; b) contacto con materiales de limpieza de acción débil o contacto prolongado con agua; c) contacto con superficies calientes que no excedan de 50 °C; d) lesiones oculares causadas por la luz solar (salvo durante la observación del sol); e) condiciones atmosféricas que no sean de naturaleza extrema. Categoría II La categoría II incluye riesgos distintos de los enumerados en las categorías I y III. Categoría III La categoría III incluye exclusivamente los riesgos que puedan tener consecuencias muy graves, como la muerte o daños irreversibles a la salud, en relación con lo siguiente: a) sustancias y mezclas peligrosas para la salud; b) atmósferas con falta de oxígeno; c) agentes biológicos nocivos; d) radiaciones ionizantes; e) ambientes con altas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de al menos 100 °C; f) ambientes con bajas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de – 50 °C o menos; g) caídas de altura; h) descargas eléctricas y trabajos en tensión; i) ahogamiento; j) cortes por sierras de cadena accionadas a mano; k) chorros de alta presión; l) heridas de bala o arma blanca; m) ruidos nocivos. , anexo I",
    "apartado": "Clasificación (Reglamento UE)"
  },
  {
    "id": "CPEI-T13-OF-AAF426BB",
    "orden": 210,
    "concepto": "Según el Reglamento (UE) 2016/425, ¿qué riesgos incluye la categoría III de EPI?",
    "respuesta": "Exclusivamente los riesgos que puedan tener consecuencias muy graves, como la muerte o daños irreversibles a la salud",
    "fuente": "Reglamento (UE) 2016/425, CATEGORÍAS DE RIESGOS CON RESPECTO A LOS EPI El presente anexo establece las categorías de riesgo del que el EPI deberá proteger a los usuarios. Categoría I La categoría I incluye exclusivamente los siguientes riesgos mínimos: a) lesiones mecánicas superficiales; b) contacto con materiales de limpieza de acción débil o contacto prolongado con agua; c) contacto con superficies calientes que no excedan de 50 °C; d) lesiones oculares causadas por la luz solar (salvo durante la observación del sol); e) condiciones atmosféricas que no sean de naturaleza extrema. Categoría II La categoría II incluye riesgos distintos de los enumerados en las categorías I y III. Categoría III La categoría III incluye exclusivamente los riesgos que puedan tener consecuencias muy graves, como la muerte o daños irreversibles a la salud, en relación con lo siguiente: a) sustancias y mezclas peligrosas para la salud; b) atmósferas con falta de oxígeno; c) agentes biológicos nocivos; d) radiaciones ionizantes; e) ambientes con altas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de al menos 100 °C; f) ambientes con bajas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de – 50 °C o menos; g) caídas de altura; h) descargas eléctricas y trabajos en tensión; i) ahogamiento; j) cortes por sierras de cadena accionadas a mano; k) chorros de alta presión; l) heridas de bala o arma blanca; m) ruidos nocivos. , anexo I. Reglamento (UE) 2016/425, texto consolidado (últ. actualización DOUE L 81 de 31/03/2016): https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32016R0425#ani",
    "localizacion": "Reglamento (UE) 2016/425, CATEGORÍAS DE RIESGOS CON RESPECTO A LOS EPI El presente anexo establece las categorías de riesgo del que el EPI deberá proteger a los usuarios. Categoría I La categoría I incluye exclusivamente los siguientes riesgos mínimos: a) lesiones mecánicas superficiales; b) contacto con materiales de limpieza de acción débil o contacto prolongado con agua; c) contacto con superficies calientes que no excedan de 50 °C; d) lesiones oculares causadas por la luz solar (salvo durante la observación del sol); e) condiciones atmosféricas que no sean de naturaleza extrema. Categoría II La categoría II incluye riesgos distintos de los enumerados en las categorías I y III. Categoría III La categoría III incluye exclusivamente los riesgos que puedan tener consecuencias muy graves, como la muerte o daños irreversibles a la salud, en relación con lo siguiente: a) sustancias y mezclas peligrosas para la salud; b) atmósferas con falta de oxígeno; c) agentes biológicos nocivos; d) radiaciones ionizantes; e) ambientes con altas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de al menos 100 °C; f) ambientes con bajas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de – 50 °C o menos; g) caídas de altura; h) descargas eléctricas y trabajos en tensión; i) ahogamiento; j) cortes por sierras de cadena accionadas a mano; k) chorros de alta presión; l) heridas de bala o arma blanca; m) ruidos nocivos. , anexo I",
    "apartado": "Clasificación (Reglamento UE)"
  },
  {
    "id": "CPEI-T13-OF-20D9B169",
    "orden": 220,
    "concepto": "Según el Reglamento (UE) 2016/425, en la categoría III, ¿con qué temperatura del aire son comparables los ambientes de altas temperaturas?",
    "respuesta": "De al menos 100 °C",
    "fuente": "Reglamento (UE) 2016/425, CATEGORÍAS DE RIESGOS CON RESPECTO A LOS EPI El presente anexo establece las categorías de riesgo del que el EPI deberá proteger a los usuarios. Categoría I La categoría I incluye exclusivamente los siguientes riesgos mínimos: a) lesiones mecánicas superficiales; b) contacto con materiales de limpieza de acción débil o contacto prolongado con agua; c) contacto con superficies calientes que no excedan de 50 °C; d) lesiones oculares causadas por la luz solar (salvo durante la observación del sol); e) condiciones atmosféricas que no sean de naturaleza extrema. Categoría II La categoría II incluye riesgos distintos de los enumerados en las categorías I y III. Categoría III La categoría III incluye exclusivamente los riesgos que puedan tener consecuencias muy graves, como la muerte o daños irreversibles a la salud, en relación con lo siguiente: a) sustancias y mezclas peligrosas para la salud; b) atmósferas con falta de oxígeno; c) agentes biológicos nocivos; d) radiaciones ionizantes; e) ambientes con altas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de al menos 100 °C; f) ambientes con bajas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de – 50 °C o menos; g) caídas de altura; h) descargas eléctricas y trabajos en tensión; i) ahogamiento; j) cortes por sierras de cadena accionadas a mano; k) chorros de alta presión; l) heridas de bala o arma blanca; m) ruidos nocivos. , anexo I. Reglamento (UE) 2016/425, texto consolidado (últ. actualización DOUE L 81 de 31/03/2016): https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32016R0425#ani",
    "localizacion": "Reglamento (UE) 2016/425, CATEGORÍAS DE RIESGOS CON RESPECTO A LOS EPI El presente anexo establece las categorías de riesgo del que el EPI deberá proteger a los usuarios. Categoría I La categoría I incluye exclusivamente los siguientes riesgos mínimos: a) lesiones mecánicas superficiales; b) contacto con materiales de limpieza de acción débil o contacto prolongado con agua; c) contacto con superficies calientes que no excedan de 50 °C; d) lesiones oculares causadas por la luz solar (salvo durante la observación del sol); e) condiciones atmosféricas que no sean de naturaleza extrema. Categoría II La categoría II incluye riesgos distintos de los enumerados en las categorías I y III. Categoría III La categoría III incluye exclusivamente los riesgos que puedan tener consecuencias muy graves, como la muerte o daños irreversibles a la salud, en relación con lo siguiente: a) sustancias y mezclas peligrosas para la salud; b) atmósferas con falta de oxígeno; c) agentes biológicos nocivos; d) radiaciones ionizantes; e) ambientes con altas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de al menos 100 °C; f) ambientes con bajas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de – 50 °C o menos; g) caídas de altura; h) descargas eléctricas y trabajos en tensión; i) ahogamiento; j) cortes por sierras de cadena accionadas a mano; k) chorros de alta presión; l) heridas de bala o arma blanca; m) ruidos nocivos. , anexo I",
    "apartado": "Clasificación (Reglamento UE)"
  },
  {
    "id": "CPEI-T13-OF-8D2DAF31",
    "orden": 230,
    "concepto": "Según el Reglamento (UE) 2016/425, en la categoría III, ¿con qué temperatura del aire son comparables los ambientes de bajas temperaturas?",
    "respuesta": "De – 50 °C o menos",
    "fuente": "Reglamento (UE) 2016/425, CATEGORÍAS DE RIESGOS CON RESPECTO A LOS EPI El presente anexo establece las categorías de riesgo del que el EPI deberá proteger a los usuarios. Categoría I La categoría I incluye exclusivamente los siguientes riesgos mínimos: a) lesiones mecánicas superficiales; b) contacto con materiales de limpieza de acción débil o contacto prolongado con agua; c) contacto con superficies calientes que no excedan de 50 °C; d) lesiones oculares causadas por la luz solar (salvo durante la observación del sol); e) condiciones atmosféricas que no sean de naturaleza extrema. Categoría II La categoría II incluye riesgos distintos de los enumerados en las categorías I y III. Categoría III La categoría III incluye exclusivamente los riesgos que puedan tener consecuencias muy graves, como la muerte o daños irreversibles a la salud, en relación con lo siguiente: a) sustancias y mezclas peligrosas para la salud; b) atmósferas con falta de oxígeno; c) agentes biológicos nocivos; d) radiaciones ionizantes; e) ambientes con altas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de al menos 100 °C; f) ambientes con bajas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de – 50 °C o menos; g) caídas de altura; h) descargas eléctricas y trabajos en tensión; i) ahogamiento; j) cortes por sierras de cadena accionadas a mano; k) chorros de alta presión; l) heridas de bala o arma blanca; m) ruidos nocivos. , anexo I. Reglamento (UE) 2016/425, texto consolidado (últ. actualización DOUE L 81 de 31/03/2016): https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32016R0425#ani",
    "localizacion": "Reglamento (UE) 2016/425, CATEGORÍAS DE RIESGOS CON RESPECTO A LOS EPI El presente anexo establece las categorías de riesgo del que el EPI deberá proteger a los usuarios. Categoría I La categoría I incluye exclusivamente los siguientes riesgos mínimos: a) lesiones mecánicas superficiales; b) contacto con materiales de limpieza de acción débil o contacto prolongado con agua; c) contacto con superficies calientes que no excedan de 50 °C; d) lesiones oculares causadas por la luz solar (salvo durante la observación del sol); e) condiciones atmosféricas que no sean de naturaleza extrema. Categoría II La categoría II incluye riesgos distintos de los enumerados en las categorías I y III. Categoría III La categoría III incluye exclusivamente los riesgos que puedan tener consecuencias muy graves, como la muerte o daños irreversibles a la salud, en relación con lo siguiente: a) sustancias y mezclas peligrosas para la salud; b) atmósferas con falta de oxígeno; c) agentes biológicos nocivos; d) radiaciones ionizantes; e) ambientes con altas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de al menos 100 °C; f) ambientes con bajas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de – 50 °C o menos; g) caídas de altura; h) descargas eléctricas y trabajos en tensión; i) ahogamiento; j) cortes por sierras de cadena accionadas a mano; k) chorros de alta presión; l) heridas de bala o arma blanca; m) ruidos nocivos. , anexo I",
    "apartado": "Clasificación (Reglamento UE)"
  },
  {
    "id": "CPEI-T13-OF-5304C460",
    "orden": 240,
    "concepto": "Según el Reglamento (UE) 2016/425, ¿en qué categoría se incluyen los riesgos de atmósferas con falta de oxígeno?",
    "respuesta": "Categoría III",
    "fuente": "Reglamento (UE) 2016/425, CATEGORÍAS DE RIESGOS CON RESPECTO A LOS EPI El presente anexo establece las categorías de riesgo del que el EPI deberá proteger a los usuarios. Categoría I La categoría I incluye exclusivamente los siguientes riesgos mínimos: a) lesiones mecánicas superficiales; b) contacto con materiales de limpieza de acción débil o contacto prolongado con agua; c) contacto con superficies calientes que no excedan de 50 °C; d) lesiones oculares causadas por la luz solar (salvo durante la observación del sol); e) condiciones atmosféricas que no sean de naturaleza extrema. Categoría II La categoría II incluye riesgos distintos de los enumerados en las categorías I y III. Categoría III La categoría III incluye exclusivamente los riesgos que puedan tener consecuencias muy graves, como la muerte o daños irreversibles a la salud, en relación con lo siguiente: a) sustancias y mezclas peligrosas para la salud; b) atmósferas con falta de oxígeno; c) agentes biológicos nocivos; d) radiaciones ionizantes; e) ambientes con altas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de al menos 100 °C; f) ambientes con bajas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de – 50 °C o menos; g) caídas de altura; h) descargas eléctricas y trabajos en tensión; i) ahogamiento; j) cortes por sierras de cadena accionadas a mano; k) chorros de alta presión; l) heridas de bala o arma blanca; m) ruidos nocivos. , anexo I. Reglamento (UE) 2016/425, texto consolidado (últ. actualización DOUE L 81 de 31/03/2016): https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32016R0425#ani",
    "localizacion": "Reglamento (UE) 2016/425, CATEGORÍAS DE RIESGOS CON RESPECTO A LOS EPI El presente anexo establece las categorías de riesgo del que el EPI deberá proteger a los usuarios. Categoría I La categoría I incluye exclusivamente los siguientes riesgos mínimos: a) lesiones mecánicas superficiales; b) contacto con materiales de limpieza de acción débil o contacto prolongado con agua; c) contacto con superficies calientes que no excedan de 50 °C; d) lesiones oculares causadas por la luz solar (salvo durante la observación del sol); e) condiciones atmosféricas que no sean de naturaleza extrema. Categoría II La categoría II incluye riesgos distintos de los enumerados en las categorías I y III. Categoría III La categoría III incluye exclusivamente los riesgos que puedan tener consecuencias muy graves, como la muerte o daños irreversibles a la salud, en relación con lo siguiente: a) sustancias y mezclas peligrosas para la salud; b) atmósferas con falta de oxígeno; c) agentes biológicos nocivos; d) radiaciones ionizantes; e) ambientes con altas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de al menos 100 °C; f) ambientes con bajas temperaturas cuyos efectos sean comparables a los de una temperatura del aire de – 50 °C o menos; g) caídas de altura; h) descargas eléctricas y trabajos en tensión; i) ahogamiento; j) cortes por sierras de cadena accionadas a mano; k) chorros de alta presión; l) heridas de bala o arma blanca; m) ruidos nocivos. , anexo I",
    "apartado": "Clasificación (Reglamento UE)"
  },
  {
    "id": "CPEI-T13-OF-45DD1D85",
    "orden": 250,
    "concepto": "Según el Reglamento (UE) 2016/425, ¿qué es un «equipo de protección individual» (definición de la letra a)?",
    "respuesta": "El equipo diseñado y fabricado para ser llevado puesto o ser sostenido por una persona para protegerse contra uno o varios riesgos para su salud o seguridad",
    "fuente": "Reglamento (UE) 2016/425, Artículo 3 Definiciones A efectos del presente Reglamento, se entenderá por: 1) «equipo de protección individual» (EPI) : a) el equipo diseñado y fabricado para ser llevado puesto o ser sostenido por una persona para protegerse contra uno o varios riesgos para su salud o seguridad; b) los componentes intercambiables del equipo mencionado en la letra a) que sean esenciales para su función protectora; c) los sistemas de conexión para el equipo mencionado en la letra a) que no sean llevados puestos ni sean sostenidos por una persona, que estén diseñados para conectar dicho equipo a un dispositivo o estructura externos o a un punto de anclaje seguro, que no estén diseñados para estar fijados permanentemente y que no requieran maniobras de abrochado antes de su uso; 2) «comercialización» : todo suministro de EPI para su distribución o utilización en el mercado de la Unión, realizado a título oneroso o gratuito, en el transcurso de una actividad comercial; 3) «introducción en el mercado» : la primera comercialización de un EPI en el mercado de la Unión; 4) «fabricante» : toda persona física o jurídica que fabrica un EPI o que lo manda diseñar o fabricar, y lo comercializa con su nombre o marca; 5) «representante autorizado» : toda persona física o jurídica establecida en la Unión que ha recibido un mandato por escrito de un fabricante para actuar en su nombre en relación con tareas específicas; 6) «importador» : toda persona física o jurídica establecida en la Unión que introduce en el mercado de la Unión EPI procedentes de un país tercero; 7) «distribuidor» : toda persona física o jurídica de la cadena de suministro, distinta del fabricante o el importador, que comercializa EPI; 8) «agentes económicos» : el fabricante, el representante autorizado, el importador y el distribuidor; 9) «especificación técnica» : un documento en el que se prescriben los requisitos técnicos que debe cumplir un EPI; 10) «norma armonizada» : una norma armonizada tal como se define en el artículo 2, punto 1, letra c), del Reglamento (UE) n. o 1025/2012; 11) «acreditación» : una acreditación tal como se define en el artículo 2, punto 10, del Reglamento (CE) n. o 765/2008; 12) «organismo nacional de acreditación» : un organismo nacional de acreditación tal como se define en el artículo 2, punto 11, del Reglamento (CE) n. o 765/2008; 13) «evaluación de la conformidad» : el proceso por el que se demuestra si se han cumplido los requisitos esenciales de salud y seguridad del presente Reglamento relativos a los EPI; 14) «organismo de evaluación de la conformidad» : un organismo que desempeña actividades de evaluación de la conformidad, incluidas la calibración, el ensayo, la certificación y la inspección; 15) «recuperación» : toda medida destinada a obtener la devolución de un EPI ya puesto a disposición del usuario final; 16) «retirada» : toda medida destinada a impedir la comercialización de un EPI que se encuentre en la cadena de suministro; 17) «legislación de armonización de la Unión» : toda legislación de la Unión que armonice las condiciones para la comercialización de los productos; 18) «marcado CE» : el marcado por el que el fabricante indica que un EPI es conforme con los requisitos aplicables establecidos en la legislación de armonización de la Unión que dispone su colocación. , art. 3.1. Reglamento (UE) 2016/425, texto consolidado (últ. actualización DOUE L 81 de 31/03/2016): https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32016R0425#a3",
    "localizacion": "Reglamento (UE) 2016/425, Artículo 3 Definiciones A efectos del presente Reglamento, se entenderá por: 1) «equipo de protección individual» (EPI) : a) el equipo diseñado y fabricado para ser llevado puesto o ser sostenido por una persona para protegerse contra uno o varios riesgos para su salud o seguridad; b) los componentes intercambiables del equipo mencionado en la letra a) que sean esenciales para su función protectora; c) los sistemas de conexión para el equipo mencionado en la letra a) que no sean llevados puestos ni sean sostenidos por una persona, que estén diseñados para conectar dicho equipo a un dispositivo o estructura externos o a un punto de anclaje seguro, que no estén diseñados para estar fijados permanentemente y que no requieran maniobras de abrochado antes de su uso; 2) «comercialización» : todo suministro de EPI para su distribución o utilización en el mercado de la Unión, realizado a título oneroso o gratuito, en el transcurso de una actividad comercial; 3) «introducción en el mercado» : la primera comercialización de un EPI en el mercado de la Unión; 4) «fabricante» : toda persona física o jurídica que fabrica un EPI o que lo manda diseñar o fabricar, y lo comercializa con su nombre o marca; 5) «representante autorizado» : toda persona física o jurídica establecida en la Unión que ha recibido un mandato por escrito de un fabricante para actuar en su nombre en relación con tareas específicas; 6) «importador» : toda persona física o jurídica establecida en la Unión que introduce en el mercado de la Unión EPI procedentes de un país tercero; 7) «distribuidor» : toda persona física o jurídica de la cadena de suministro, distinta del fabricante o el importador, que comercializa EPI; 8) «agentes económicos» : el fabricante, el representante autorizado, el importador y el distribuidor; 9) «especificación técnica» : un documento en el que se prescriben los requisitos técnicos que debe cumplir un EPI; 10) «norma armonizada» : una norma armonizada tal como se define en el artículo 2, punto 1, letra c), del Reglamento (UE) n. o 1025/2012; 11) «acreditación» : una acreditación tal como se define en el artículo 2, punto 10, del Reglamento (CE) n. o 765/2008; 12) «organismo nacional de acreditación» : un organismo nacional de acreditación tal como se define en el artículo 2, punto 11, del Reglamento (CE) n. o 765/2008; 13) «evaluación de la conformidad» : el proceso por el que se demuestra si se han cumplido los requisitos esenciales de salud y seguridad del presente Reglamento relativos a los EPI; 14) «organismo de evaluación de la conformidad» : un organismo que desempeña actividades de evaluación de la conformidad, incluidas la calibración, el ensayo, la certificación y la inspección; 15) «recuperación» : toda medida destinada a obtener la devolución de un EPI ya puesto a disposición del usuario final; 16) «retirada» : toda medida destinada a impedir la comercialización de un EPI que se encuentre en la cadena de suministro; 17) «legislación de armonización de la Unión» : toda legislación de la Unión que armonice las condiciones para la comercialización de los productos; 18) «marcado CE» : el marcado por el que el fabricante indica que un EPI es conforme con los requisitos aplicables establecidos en la legislación de armonización de la Unión que dispone su colocación. , art. 3.1",
    "apartado": "Clasificación (Reglamento UE)"
  }
];
