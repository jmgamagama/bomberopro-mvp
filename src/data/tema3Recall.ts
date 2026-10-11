/** Tema 3 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (BOE-A-1985-5392). Calidad: data/tema03/tema03_calidad.md. */

export type Tema3RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA3_RECALL_META = {
  "tema": 3,
  "title": "Tema 3 · LBRL: la Provincia (organización y competencias)",
  "count": 66,
  "source": "Fase 2 · texto consolidado BOE-A-1985-5392 (Título III, arts. 31-38; últ. act. 03/10/2026)"
} as const;

export const TEMA3_RECALL_CARDS: Tema3RecallCard[] = [
  {
    "id": "CPEI-T03-OF-2555E6DD",
    "orden": 10,
    "concepto": "Según la LBRL, ¿qué es la Provincia?",
    "respuesta": "Una entidad local determinada por la agrupación de Municipios, con personalidad jurídica propia y plena capacidad para el cumplimiento de sus fines",
    "fuente": "Ley 7/1985 (LBRL), Artículo 31, apdo. 1. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a31",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 31, apdo. 1",
    "apartado": "Provincia: concepto"
  },
  {
    "id": "CPEI-T03-OF-BE91FC88",
    "orden": 20,
    "concepto": "Según la LBRL, ¿qué principios intermunicipales tiene como fin propio y específico garantizar la Provincia?",
    "respuesta": "Los principios de solidaridad y equilibrio intermunicipales",
    "fuente": "Ley 7/1985 (LBRL), Artículo 31, apdo. 2. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a31",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 31, apdo. 2",
    "apartado": "Provincia: fines"
  },
  {
    "id": "CPEI-T03-OF-13CA1DAD",
    "orden": 30,
    "concepto": "Según el art. 31.2.b) LBRL, ¿en qué coordinación participa la Provincia?",
    "respuesta": "En la coordinación de la Administración local con la de la Comunidad Autónoma y la del Estado",
    "fuente": "Ley 7/1985 (LBRL), Artículo 31, apdo. 2.b. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a31",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 31, apdo. 2.b",
    "apartado": "Provincia: fines"
  },
  {
    "id": "CPEI-T03-OF-F13BCF88",
    "orden": 40,
    "concepto": "Según la LBRL, ¿a quién corresponden el gobierno y la administración autónoma de la Provincia?",
    "respuesta": "A la Diputación u otras Corporaciones de carácter representativo",
    "fuente": "Ley 7/1985 (LBRL), Artículo 31, apdo. 3. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a31",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 31, apdo. 3",
    "apartado": "Provincia: gobierno"
  },
  {
    "id": "CPEI-T03-OF-18D243E3",
    "orden": 50,
    "concepto": "Según la LBRL, ¿qué cuatro órganos existen en todas las Diputaciones?",
    "respuesta": "El Presidente, los Vicepresidentes, la Junta de Gobierno y el Pleno",
    "fuente": "Ley 7/1985 (LBRL), Artículo 32, apdo. 1. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a32",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 32, apdo. 1",
    "apartado": "Organización provincial"
  },
  {
    "id": "CPEI-T03-OF-4384A2DF",
    "orden": 60,
    "concepto": "Según el art. 32.2 LBRL, ¿qué objeto tienen los órganos de estudio que existen en todas las Diputaciones?",
    "respuesta": "El estudio, informe o consulta de los asuntos que han de ser sometidos a la decisión del Pleno",
    "fuente": "Ley 7/1985 (LBRL), Artículo 32, apdo. 2. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a32",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 32, apdo. 2",
    "apartado": "Organización provincial"
  },
  {
    "id": "CPEI-T03-OF-B865DD34",
    "orden": 70,
    "concepto": "En los órganos de estudio, informe o consulta de la Diputación, ¿cómo participan los grupos políticos?",
    "respuesta": "Mediante la presencia de Diputados pertenecientes a los mismos, en proporción al número de Diputados que tengan en el Pleno",
    "fuente": "Ley 7/1985 (LBRL), Artículo 32, apdo. 2. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a32",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 32, apdo. 2",
    "apartado": "Organización provincial"
  },
  {
    "id": "CPEI-T03-OF-60344240",
    "orden": 80,
    "concepto": "Según la LBRL, ¿quién establece y regula los órganos complementarios de la Diputación?",
    "respuesta": "Las propias Diputaciones",
    "fuente": "Ley 7/1985 (LBRL), Artículo 32, apdo. 3. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a32",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 32, apdo. 3",
    "apartado": "Organización provincial"
  },
  {
    "id": "CPEI-T03-OF-7B38BEBB",
    "orden": 90,
    "concepto": "Según el art. 32.3 LBRL, ¿qué leyes pueden establecer una organización provincial complementaria?",
    "respuesta": "Las leyes de las comunidades autónomas sobre régimen local",
    "fuente": "Ley 7/1985 (LBRL), Artículo 32, apdo. 3. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a32",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 32, apdo. 3",
    "apartado": "Organización provincial"
  },
  {
    "id": "CPEI-T03-OF-2CC9630D",
    "orden": 100,
    "concepto": "Según la LBRL, ¿quiénes constituyen el Pleno de la Diputación?",
    "respuesta": "El Presidente y los Diputados",
    "fuente": "Ley 7/1985 (LBRL), Artículo 33, apdo. 1. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a33",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 33, apdo. 1",
    "apartado": "Pleno"
  },
  {
    "id": "CPEI-T03-OF-F9CA1545",
    "orden": 110,
    "concepto": "Según el art. 33.2 LBRL, ¿a qué órgano corresponde la organización de la Diputación?",
    "respuesta": "Al Pleno",
    "fuente": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.a. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a33",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.a",
    "apartado": "Pleno: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-0288360A",
    "orden": 120,
    "concepto": "Según el art. 33.2 LBRL, ¿qué órgano de la Diputación aprueba las ordenanzas?",
    "respuesta": "El Pleno",
    "fuente": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.b. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a33",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.b",
    "apartado": "Pleno: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-A4BB6E7D",
    "orden": 130,
    "concepto": "Según el art. 33.2 LBRL, ¿qué órgano de la Diputación aprueba los planes de carácter provincial?",
    "respuesta": "El Pleno",
    "fuente": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.d. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a33",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.d",
    "apartado": "Pleno: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-88FD5009",
    "orden": 140,
    "concepto": "Según el art. 33.2.e) LBRL, ¿qué control corresponde al Pleno de la Diputación?",
    "respuesta": "El control y la fiscalización de los órganos de gobierno",
    "fuente": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.e. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a33",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.e",
    "apartado": "Pleno: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-5602DEC6",
    "orden": 150,
    "concepto": "Según el art. 33.2.f) LBRL, ¿qué instrumentos de personal aprueba el Pleno de la Diputación?",
    "respuesta": "La plantilla de personal y la relación de puestos de trabajo",
    "fuente": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.f. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a33",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.f",
    "apartado": "Pleno: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-3B115157",
    "orden": 160,
    "concepto": "Según el art. 33.2.g) LBRL, ¿qué alteración sobre bienes corresponde al Pleno de la Diputación?",
    "respuesta": "La alteración de la calificación jurídica de los bienes de dominio público",
    "fuente": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.g. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a33",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.g",
    "apartado": "Pleno: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-2E4B1B67",
    "orden": 170,
    "concepto": "Según el art. 33.2 LBRL, ¿qué órgano de la Diputación declara la lesividad de sus actos?",
    "respuesta": "El Pleno",
    "fuente": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.j. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a33",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.j",
    "apartado": "Pleno: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-1B7E02FD",
    "orden": 180,
    "concepto": "Según el art. 33.2.k) LBRL, ¿a partir de qué porcentaje de los recursos ordinarios corresponde al Pleno concertar operaciones de crédito?",
    "respuesta": "Cuando su cuantía acumulada en el ejercicio económico exceda del 10 por 100 de los recursos ordinarios",
    "fuente": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.k. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a33",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.k",
    "apartado": "Pleno: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-7018C321",
    "orden": 190,
    "concepto": "Según el art. 33.2.k) LBRL, ¿cuándo corresponden al Pleno de la Diputación las operaciones de tesorería?",
    "respuesta": "Cuando el importe acumulado de las operaciones vivas en cada momento supere el 15 por 100 de los ingresos corrientes liquidados en el ejercicio anterior",
    "fuente": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.k. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a33",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 33, apdo. 2.k",
    "apartado": "Pleno: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-010263BF",
    "orden": 200,
    "concepto": "Según el art. 33.3 LBRL, ¿qué votaciones sobre el Presidente de la Diputación corresponden al Pleno?",
    "respuesta": "La moción de censura al Presidente y la cuestión de confianza planteada por el mismo",
    "fuente": "Ley 7/1985 (LBRL), Artículo 33, apdo. 3. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a33",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 33, apdo. 3",
    "apartado": "Pleno: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-D6807681",
    "orden": 210,
    "concepto": "Según la LBRL, ¿cómo se realizan en la Diputación las votaciones de la moción de censura y de la cuestión de confianza?",
    "respuesta": "Serán públicas y se realizarán mediante llamamiento nominal en todo caso",
    "fuente": "Ley 7/1985 (LBRL), Artículo 33, apdo. 3. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a33",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 33, apdo. 3",
    "apartado": "Pleno: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-BE57E434",
    "orden": 220,
    "concepto": "Según la LBRL, ¿por qué legislación se rigen la moción de censura y la cuestión de confianza del Presidente de la Diputación?",
    "respuesta": "Por la legislación electoral general",
    "fuente": "Ley 7/1985 (LBRL), Artículo 33, apdo. 3. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a33",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 33, apdo. 3",
    "apartado": "Pleno: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-4C4663F0",
    "orden": 230,
    "concepto": "Según el art. 33.4 LBRL, ¿en qué órganos puede delegar el Pleno de la Diputación el ejercicio de sus atribuciones?",
    "respuesta": "En el Presidente y en la Comisión de Gobierno",
    "fuente": "Ley 7/1985 (LBRL), Artículo 33, apdo. 4. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a33",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 33, apdo. 4",
    "apartado": "Pleno: delegación"
  },
  {
    "id": "CPEI-T03-OF-A7DAF4E4",
    "orden": 240,
    "concepto": "Según el art. 33.4 LBRL, ¿qué letras del apartado 2 recogen atribuciones indelegables del Pleno de la Diputación?",
    "respuesta": "Letras a), b), c), d), e), f), h) y ñ)",
    "fuente": "Ley 7/1985 (LBRL), Artículo 33, apdo. 4. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a33",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 33, apdo. 4",
    "apartado": "Pleno: delegación"
  },
  {
    "id": "CPEI-T03-OF-DCD29BDA",
    "orden": 250,
    "concepto": "Según el art. 34.1.a) LBRL, ¿qué dirige el Presidente de la Diputación?",
    "respuesta": "El gobierno y la administración de la provincia",
    "fuente": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.a. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a34",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.a",
    "apartado": "Presidente: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-97B80E5B",
    "orden": 260,
    "concepto": "Según el art. 34.1 LBRL, ¿quién representa a la Diputación?",
    "respuesta": "El Presidente de la Diputación",
    "fuente": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.b. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a34",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.b",
    "apartado": "Presidente: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-C29E5505",
    "orden": 270,
    "concepto": "Según el art. 34.1.c) LBRL, ¿cómo decide los empates el Presidente de la Diputación?",
    "respuesta": "Con voto de calidad",
    "fuente": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.c. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a34",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.c",
    "apartado": "Presidente: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-8408254B",
    "orden": 280,
    "concepto": "Según el art. 34.1.e) LBRL, ¿qué gestión de la Comunidad Autónoma asegura el Presidente de la Diputación?",
    "respuesta": "La gestión de los servicios propios de la Comunidad Autónoma cuya gestión ordinaria esté encomendada a la Diputación",
    "fuente": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.e. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a34",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.e",
    "apartado": "Presidente: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-0E8B6FC3",
    "orden": 290,
    "concepto": "Según el art. 34.1.g) LBRL, ¿qué aprueba el Presidente de la Diputación en materia de empleo público?",
    "respuesta": "La oferta de empleo público de acuerdo con el Presupuesto y la plantilla aprobados por el Pleno",
    "fuente": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.g. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a34",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.g",
    "apartado": "Presidente: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-918A0B29",
    "orden": 300,
    "concepto": "Según el art. 34.1.g) LBRL, ¿qué bases aprueba el Presidente de la Diputación?",
    "respuesta": "Las bases de las pruebas para la selección del personal y para los concursos de provisión de puestos de trabajo",
    "fuente": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.g. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a34",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.g",
    "apartado": "Presidente: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-63FF290E",
    "orden": 310,
    "concepto": "Según el art. 34.1.h) LBRL, ¿qué jefatura desempeña el Presidente de la Diputación?",
    "respuesta": "La jefatura superior de todo el personal",
    "fuente": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.h. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a34",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.h",
    "apartado": "Presidente: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-9BD33F7F",
    "orden": 320,
    "concepto": "Según el art. 34.1.h) LBRL, cuando el Presidente de la Diputación acuerda la separación del servicio de un funcionario, ¿a quién da cuenta y cuándo?",
    "respuesta": "Al Pleno en la primera sesión que celebre",
    "fuente": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.h. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a34",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.h",
    "apartado": "Presidente: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-507DE80C",
    "orden": 330,
    "concepto": "Según el art. 34.1.n) LBRL, ¿qué hace el Presidente de la Diputación respecto de los acuerdos de la Diputación?",
    "respuesta": "Ordenar la publicación y ejecución y hacer cumplir los acuerdos de la Diputación",
    "fuente": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.n. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a34",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.n",
    "apartado": "Presidente: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-02420539",
    "orden": 340,
    "concepto": "Según el art. 34.1.o) LBRL, ¿qué atribuciones residuales corresponden al Presidente de la Diputación?",
    "respuesta": "Las que la legislación del Estado o de las Comunidades Autónomas asigne a la Diputación y no estén expresamente atribuidas a otros órganos",
    "fuente": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.o. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a34",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 34, apdo. 1.o",
    "apartado": "Presidente: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-3D29C546",
    "orden": 350,
    "concepto": "Según el art. 34.2 LBRL, ¿qué sesiones no puede delegar el Presidente de la Diputación convocar y presidir?",
    "respuesta": "Las sesiones del Pleno y de la Junta de Gobierno",
    "fuente": "Ley 7/1985 (LBRL), Artículo 34, apdo. 2. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a34",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 34, apdo. 2",
    "apartado": "Presidente: delegación"
  },
  {
    "id": "CPEI-T03-OF-4CB3ABF9",
    "orden": 360,
    "concepto": "Según la LBRL, ¿a quién corresponde el nombramiento de los Vicepresidentes de la Diputación?",
    "respuesta": "Al Presidente",
    "fuente": "Ley 7/1985 (LBRL), Artículo 34, apdo. 3. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a34",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 34, apdo. 3",
    "apartado": "Presidente: atribuciones"
  },
  {
    "id": "CPEI-T03-OF-01E24320",
    "orden": 370,
    "concepto": "Según la LBRL, ¿quiénes integran la Junta de Gobierno de la Diputación?",
    "respuesta": "El Presidente y un número de Diputados no superior al tercio del número legal de los mismos",
    "fuente": "Ley 7/1985 (LBRL), Artículo 35, apdo. 1. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a35",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 35, apdo. 1",
    "apartado": "Junta de Gobierno"
  },
  {
    "id": "CPEI-T03-OF-6A409575",
    "orden": 380,
    "concepto": "Según el art. 35.2 LBRL, ¿qué función de asistencia corresponde a la Junta de Gobierno de la Diputación?",
    "respuesta": "La asistencia al Presidente en el ejercicio de sus atribuciones",
    "fuente": "Ley 7/1985 (LBRL), Artículo 35, apdo. 2.a. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a35",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 35, apdo. 2.a",
    "apartado": "Junta de Gobierno"
  },
  {
    "id": "CPEI-T03-OF-0C353368",
    "orden": 390,
    "concepto": "Según el art. 35.3 LBRL, ¿a favor de quién puede el Presidente de la Diputación realizar delegaciones especiales para cometidos específicos?",
    "respuesta": "A favor de cualesquiera Diputados, aunque no perteneciera a la Junta de Gobierno",
    "fuente": "Ley 7/1985 (LBRL), Artículo 35, apdo. 3. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a35",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 35, apdo. 3",
    "apartado": "Junta de Gobierno"
  },
  {
    "id": "CPEI-T03-OF-DBEAA57B",
    "orden": 400,
    "concepto": "Según la LBRL, ¿en qué casos sustituyen los Vicepresidentes al Presidente de la Diputación?",
    "respuesta": "En los casos de vacante, ausencia o enfermedad",
    "fuente": "Ley 7/1985 (LBRL), Artículo 35, apdo. 4. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a35",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 35, apdo. 4",
    "apartado": "Vicepresidentes"
  },
  {
    "id": "CPEI-T03-OF-B278F14A",
    "orden": 410,
    "concepto": "Según la LBRL, ¿en qué orden sustituyen los Vicepresidentes al Presidente de la Diputación?",
    "respuesta": "Por el orden de su nombramiento",
    "fuente": "Ley 7/1985 (LBRL), Artículo 35, apdo. 4. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a35",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 35, apdo. 4",
    "apartado": "Vicepresidentes"
  },
  {
    "id": "CPEI-T03-OF-82500C8B",
    "orden": 420,
    "concepto": "Según la LBRL, ¿entre quiénes designa el Presidente de la Diputación a los Vicepresidentes?",
    "respuesta": "Entre los miembros de la Junta de Gobierno",
    "fuente": "Ley 7/1985 (LBRL), Artículo 35, apdo. 4. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a35",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 35, apdo. 4",
    "apartado": "Vicepresidentes"
  },
  {
    "id": "CPEI-T03-OF-6977C5A0",
    "orden": 430,
    "concepto": "Según el art. 36.1.b) LBRL, ¿en qué municipios garantiza la Diputación la prestación de los servicios de secretaría e intervención?",
    "respuesta": "En los municipios de menos de 1.000 habitantes",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.b. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.b",
    "apartado": "Competencias"
  },
  {
    "id": "CPEI-T03-OF-022E3307",
    "orden": 440,
    "concepto": "Según el art. 36.1.b) LBRL, ¿a qué municipios presta la Diputación asistencia y cooperación jurídica, económica y técnica especialmente?",
    "respuesta": "A los de menor capacidad económica y de gestión",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.b. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.b",
    "apartado": "Competencias"
  },
  {
    "id": "CPEI-T03-OF-46B731CD",
    "orden": 450,
    "concepto": "Según el art. 36.1.c) LBRL, ¿en qué municipios asume la Diputación la prestación del servicio de prevención y extinción de incendios?",
    "respuesta": "En los de menos de 20.000 habitantes, cuando éstos no procedan a su prestación",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.c. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.c",
    "apartado": "Competencias"
  },
  {
    "id": "CPEI-T03-OF-724B7ECF",
    "orden": 460,
    "concepto": "Según el art. 36.1.c) LBRL, ¿en qué municipios asume la Diputación los servicios de tratamiento de residuos?",
    "respuesta": "En los municipios de menos de 5.000 habitantes",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.c. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.c",
    "apartado": "Competencias"
  },
  {
    "id": "CPEI-T03-OF-C6D09146",
    "orden": 470,
    "concepto": "Según el art. 36.1.c) LBRL, ¿qué servicios públicos presta la Diputación según su ámbito?",
    "respuesta": "Servicios públicos de carácter supramunicipal y, en su caso, supracomarcal",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.c. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.c",
    "apartado": "Competencias"
  },
  {
    "id": "CPEI-T03-OF-C8B43676",
    "orden": 480,
    "concepto": "Según el art. 36.1.e) LBRL, ¿en qué casos ejerce la Diputación funciones de coordinación?",
    "respuesta": "En los casos previstos en el artículo 116 bis",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.e. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.e",
    "apartado": "Competencias"
  },
  {
    "id": "CPEI-T03-OF-332A225F",
    "orden": 490,
    "concepto": "Según el art. 36.1.f) LBRL, ¿a qué municipios asiste la Diputación en la gestión de la recaudación tributaria?",
    "respuesta": "A los municipios con población inferior a 20.000 habitantes",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.f. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.f",
    "apartado": "Competencias"
  },
  {
    "id": "CPEI-T03-OF-C40FA8E6",
    "orden": 500,
    "concepto": "Según el art. 36.1.g) LBRL, ¿qué servicios presta la Diputación en los municipios con población inferior a 20.000 habitantes?",
    "respuesta": "Los servicios de administración electrónica y la contratación centralizada",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.g. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.g",
    "apartado": "Competencias"
  },
  {
    "id": "CPEI-T03-OF-A00F57C9",
    "orden": 510,
    "concepto": "Según el art. 36.1.h) LBRL, ¿qué seguimiento hace la Diputación de los servicios municipales?",
    "respuesta": "El seguimiento de los costes efectivos de los servicios prestados por los municipios de su provincia",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.h. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.h",
    "apartado": "Competencias"
  },
  {
    "id": "CPEI-T03-OF-58F7AC23",
    "orden": 520,
    "concepto": "Según el art. 36.1.i) LBRL, ¿qué servicio coordina la Diputación mediante convenio con la Comunidad Autónoma en municipios de menos de 5000 habitantes?",
    "respuesta": "El servicio de mantenimiento y limpieza de los consultorios médicos",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.i. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 1.i",
    "apartado": "Competencias"
  },
  {
    "id": "CPEI-T03-OF-FB176FE1",
    "orden": 530,
    "concepto": "Según el art. 36.2.a) LBRL, ¿con qué periodicidad aprueba la Diputación el plan provincial de cooperación a las obras y servicios de competencia municipal?",
    "respuesta": "Anualmente",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.a. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.a",
    "apartado": "Plan provincial de cooperación"
  },
  {
    "id": "CPEI-T03-OF-F2FC171E",
    "orden": 540,
    "concepto": "Según el art. 36.2.a) LBRL, ¿quién debe participar en la elaboración del plan provincial de cooperación a las obras y servicios?",
    "respuesta": "Los Municipios de la Provincia",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.a. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.a",
    "apartado": "Plan provincial de cooperación"
  },
  {
    "id": "CPEI-T03-OF-E3FE80AE",
    "orden": 550,
    "concepto": "Según el art. 36.2.a) LBRL, ¿qué debe contener el plan provincial de cooperación?",
    "respuesta": "Una memoria justificativa de sus objetivos y de los criterios de distribución de los fondos",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.a. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.a",
    "apartado": "Plan provincial de cooperación"
  },
  {
    "id": "CPEI-T03-OF-BAA2CFE1",
    "orden": 560,
    "concepto": "Según el art. 36.2.a) LBRL, ¿cómo han de ser los criterios de distribución de los fondos del plan provincial de cooperación?",
    "respuesta": "Objetivos y equitativos",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.a. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.a",
    "apartado": "Plan provincial de cooperación"
  },
  {
    "id": "CPEI-T03-OF-D50B2E19",
    "orden": 570,
    "concepto": "Según el art. 36.2.a) LBRL, ¿con qué puede financiarse el plan provincial de cooperación?",
    "respuesta": "Con medios propios de la Diputación, las aportaciones municipales y las subvenciones que acuerden la Comunidad Autónoma y el Estado",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.a. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.a",
    "apartado": "Plan provincial de cooperación"
  },
  {
    "id": "CPEI-T03-OF-D81124B5",
    "orden": 580,
    "concepto": "Según el art. 36.2.a) LBRL, ¿quién asegura en su territorio la coordinación de los diversos planes provinciales?",
    "respuesta": "La Comunidad Autónoma",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.a. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.a",
    "apartado": "Plan provincial de cooperación"
  },
  {
    "id": "CPEI-T03-OF-C3902F42",
    "orden": 590,
    "concepto": "Según el art. 36.2.b) LBRL, ¿a través de qué se instrumentan las subvenciones y ayudas de la Diputación para obras y servicios municipales?",
    "respuesta": "A través de planes especiales u otros instrumentos específicos",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.b. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.b",
    "apartado": "Competencias"
  },
  {
    "id": "CPEI-T03-OF-8E4D15AE",
    "orden": 600,
    "concepto": "Según el art. 36.2.c) LBRL, ¿en qué presta apoyo la Diputación a los Ayuntamientos en materia de personal?",
    "respuesta": "En la selección y formación de su personal",
    "fuente": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.c. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a36",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 36, apdo. 2.c",
    "apartado": "Competencias"
  },
  {
    "id": "CPEI-T03-OF-CE5BFBFA",
    "orden": 610,
    "concepto": "Según la LBRL, ¿qué pueden hacer las Comunidades Autónomas respecto de las Diputaciones además de delegarles competencias?",
    "respuesta": "Encomendar a éstas la gestión ordinaria de servicios propios",
    "fuente": "Ley 7/1985 (LBRL), Artículo 37, apdo. 1. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a37",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 37, apdo. 1",
    "apartado": "Delegación"
  },
  {
    "id": "CPEI-T03-OF-D9B4ECA9",
    "orden": 620,
    "concepto": "Según el art. 37.1 LBRL, en la gestión ordinaria encomendada por la Comunidad Autónoma, ¿con qué sujeción actúan las Diputaciones?",
    "respuesta": "Con sujeción plena a las instrucciones generales y particulares de las Comunidades",
    "fuente": "Ley 7/1985 (LBRL), Artículo 37, apdo. 1. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a37",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 37, apdo. 1",
    "apartado": "Delegación"
  },
  {
    "id": "CPEI-T03-OF-069AE5F8",
    "orden": 630,
    "concepto": "Según el art. 37.2 LBRL, ¿qué competencias puede delegar el Estado en las Diputaciones?",
    "respuesta": "Competencias de mera ejecución",
    "fuente": "Ley 7/1985 (LBRL), Artículo 37, apdo. 2. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a37",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 37, apdo. 2",
    "apartado": "Delegación"
  },
  {
    "id": "CPEI-T03-OF-E7A49603",
    "orden": 640,
    "concepto": "Según el art. 37.2 LBRL, ¿qué requisito previo exige la delegación del Estado en las Diputaciones?",
    "respuesta": "Previa consulta e informe de la Comunidad Autónoma interesada",
    "fuente": "Ley 7/1985 (LBRL), Artículo 37, apdo. 2. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a37",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 37, apdo. 2",
    "apartado": "Delegación"
  },
  {
    "id": "CPEI-T03-OF-C75B90A6",
    "orden": 650,
    "concepto": "Según la LBRL, ¿a qué artículo se acomoda el ejercicio por las Diputaciones de las facultades delegadas?",
    "respuesta": "Al artículo 27",
    "fuente": "Ley 7/1985 (LBRL), Artículo 37, apdo. 3. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a37",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 37, apdo. 3",
    "apartado": "Delegación"
  },
  {
    "id": "CPEI-T03-OF-63B7EA6A",
    "orden": 660,
    "concepto": "Según el art. 38 LBRL, ¿a qué otras Corporaciones se aplican las previsiones establecidas para la Diputación?",
    "respuesta": "A aquellas Corporaciones de carácter representativo a las que corresponda el gobierno y la administración autónoma de la Provincia",
    "fuente": "Ley 7/1985 (LBRL), Artículo 38. BOE-A-1985-5392, texto consolidado (últ. actualización 03/10/2026): https://www.boe.es/buscar/act.php?id=BOE-A-1985-5392#a38",
    "localizacion": "Ley 7/1985 (LBRL), Artículo 38",
    "apartado": "Otras corporaciones"
  }
];
