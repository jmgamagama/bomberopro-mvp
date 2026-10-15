/** Tema 28 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (BOE-A-2001-11881, BOE-A-2002-18099, BOE-A-2008-5269). Calidad: data/tema28/tema28_calidad.md. */

export type Tema28RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA28_RECALL_META = {
  "tema": 28,
  "title": "Tema 28 · Electricidad: riesgo eléctrico, redes y procedimientos (RD 614/2001, REBT y RLAT)",
  "count": 29,
  "source": "Fase 4 · RD 614/2001 (BOE-A-2001-11881) y REBT (BOE-A-2002-18099), últ. act. 18/12/2025; RD 223/2008 (BOE-A-2008-5269), últ. act. 19/12/2025"
} as const;

export const TEMA28_RECALL_CARDS: Tema28RecallCard[] = [
  {
    "id": "CPEI-T28-OF-CD485168",
    "orden": 10,
    "concepto": "Según el RD 614/2001, ¿qué es el riesgo eléctrico?",
    "respuesta": "Riesgo originado por la energía eléctrica",
    "fuente": "RD 614/2001, anexo I.1. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#ani",
    "localizacion": "RD 614/2001, anexo I.1",
    "apartado": "Definiciones y riesgo eléctrico"
  },
  {
    "id": "CPEI-T28-OF-48819D64",
    "orden": 20,
    "concepto": "Según el RD 614/2001, ¿qué es el contacto eléctrico directo?",
    "respuesta": "Choque eléctrico por contacto con elementos en tensión",
    "fuente": "RD 614/2001, anexo I.1.a). BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#ani",
    "localizacion": "RD 614/2001, anexo I.1.a)",
    "apartado": "Definiciones y riesgo eléctrico"
  },
  {
    "id": "CPEI-T28-OF-B1D78F6A",
    "orden": 30,
    "concepto": "Según el RD 614/2001, ¿qué es la zona de peligro o zona de trabajos en tensión?",
    "respuesta": "Espacio alrededor de los elementos en tensión en el que la presencia de un trabajador desprotegido supone un riesgo grave e inminente de que se produzca un arco eléctrico, o un contacto directo con el elemento en tensión",
    "fuente": "RD 614/2001, anexo I.7. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#ani",
    "localizacion": "RD 614/2001, anexo I.7",
    "apartado": "Definiciones y riesgo eléctrico"
  },
  {
    "id": "CPEI-T28-OF-464182C9",
    "orden": 40,
    "concepto": "Según el RD 614/2001, ¿qué es la zona de proximidad?",
    "respuesta": "Espacio delimitado alrededor de la zona de peligro, desde la que el trabajador puede invadir accidentalmente esta última",
    "fuente": "RD 614/2001, anexo I.11. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#ani",
    "localizacion": "RD 614/2001, anexo I.11",
    "apartado": "Definiciones y riesgo eléctrico"
  },
  {
    "id": "CPEI-T28-OF-4C10FCAA",
    "orden": 50,
    "concepto": "Según el RD 614/2001, ¿qué es una maniobra?",
    "respuesta": "Intervención concebida para cambiar el estado eléctrico de una instalación eléctrica no implicando montaje ni desmontaje de elemento alguno",
    "fuente": "RD 614/2001, anexo I.9. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#ani",
    "localizacion": "RD 614/2001, anexo I.9",
    "apartado": "Definiciones y riesgo eléctrico"
  },
  {
    "id": "CPEI-T28-OF-0B0A59F0",
    "orden": 60,
    "concepto": "Según el RD 614/2001, ¿qué experiencia certificada mínima define al trabajador cualificado?",
    "respuesta": "Dos o más años",
    "fuente": "RD 614/2001, anexo I.14. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#ani",
    "localizacion": "RD 614/2001, anexo I.14",
    "apartado": "Definiciones y riesgo eléctrico"
  },
  {
    "id": "CPEI-T28-OF-D51FBB16",
    "orden": 70,
    "concepto": "Según el RD 614/2001, ¿quién es el jefe de trabajo?",
    "respuesta": "Persona designada por el empresario para asumir la responsabilidad efectiva de los trabajos",
    "fuente": "RD 614/2001, anexo I.15. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#ani",
    "localizacion": "RD 614/2001, anexo I.15",
    "apartado": "Definiciones y riesgo eléctrico"
  },
  {
    "id": "CPEI-T28-OF-578C5B2C",
    "orden": 80,
    "concepto": "Según el RD 614/2001, ¿cómo se calculan las distancias de la tabla 1 para valores de tensión intermedios?",
    "respuesta": "Por interpolación lineal",
    "fuente": "RD 614/2001, anexo I, tabla 1. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#ani",
    "localizacion": "RD 614/2001, anexo I, tabla 1",
    "apartado": "Procedimientos de actuación"
  },
  {
    "id": "CPEI-T28-OF-E8528D23",
    "orden": 90,
    "concepto": "Según el RD 614/2001, ¿qué indica la distancia DPEL-1?",
    "respuesta": "Distancia hasta el límite exterior de la zona de peligro cuando exista riesgo de sobretensión por rayo",
    "fuente": "RD 614/2001, anexo I, tabla 1. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#ani",
    "localizacion": "RD 614/2001, anexo I, tabla 1",
    "apartado": "Procedimientos de actuación"
  },
  {
    "id": "CPEI-T28-OF-B831483B",
    "orden": 100,
    "concepto": "Según el RD 614/2001, ¿cómo debe efectuarse, como regla general, todo trabajo con riesgo eléctrico en una instalación?",
    "respuesta": "Sin tensión",
    "fuente": "RD 614/2001, Artículo 4. Técnicas y procedimientos de trabajo, art. 4.2. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#a4",
    "localizacion": "RD 614/2001, Artículo 4. Técnicas y procedimientos de trabajo, art. 4.2",
    "apartado": "Procedimientos de actuación"
  },
  {
    "id": "CPEI-T28-OF-2391D4E9",
    "orden": 110,
    "concepto": "Según el RD 614/2001, ¿en cuántas etapas se desarrolla la supresión de la tensión?",
    "respuesta": "En cinco etapas",
    "fuente": "RD 614/2001, anexo II.A.1. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#anii",
    "localizacion": "RD 614/2001, anexo II.A.1",
    "apartado": "Procedimientos de actuación"
  },
  {
    "id": "CPEI-T28-OF-1B3C4DAB",
    "orden": 120,
    "concepto": "Según el RD 614/2001, ¿cuál es la primera etapa para dejar una instalación sin tensión?",
    "respuesta": "Desconectar",
    "fuente": "RD 614/2001, anexo II.A.1. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#anii",
    "localizacion": "RD 614/2001, anexo II.A.1",
    "apartado": "Procedimientos de actuación"
  },
  {
    "id": "CPEI-T28-OF-FABC12A0",
    "orden": 130,
    "concepto": "Según el RD 614/2001, ¿cuál es la segunda etapa para dejar una instalación sin tensión?",
    "respuesta": "Prevenir cualquier posible realimentación",
    "fuente": "RD 614/2001, anexo II.A.1. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#anii",
    "localizacion": "RD 614/2001, anexo II.A.1",
    "apartado": "Procedimientos de actuación"
  },
  {
    "id": "CPEI-T28-OF-581C3F0F",
    "orden": 140,
    "concepto": "Según el RD 614/2001, ¿cuál es la tercera etapa para dejar una instalación sin tensión?",
    "respuesta": "Verificar la ausencia de tensión",
    "fuente": "RD 614/2001, anexo II.A.1. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#anii",
    "localizacion": "RD 614/2001, anexo II.A.1",
    "apartado": "Procedimientos de actuación"
  },
  {
    "id": "CPEI-T28-OF-D869C298",
    "orden": 150,
    "concepto": "Según el RD 614/2001, ¿cuál es la cuarta etapa para dejar una instalación sin tensión?",
    "respuesta": "Poner a tierra y en cortocircuito",
    "fuente": "RD 614/2001, anexo II.A.1. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#anii",
    "localizacion": "RD 614/2001, anexo II.A.1",
    "apartado": "Procedimientos de actuación"
  },
  {
    "id": "CPEI-T28-OF-CAE4718E",
    "orden": 160,
    "concepto": "Según el RD 614/2001, ¿cómo se aseguran preferentemente los dispositivos de maniobra contra una reconexión?",
    "respuesta": "Por bloqueo del mecanismo de maniobra",
    "fuente": "RD 614/2001, anexo II.A.1. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#anii",
    "localizacion": "RD 614/2001, anexo II.A.1",
    "apartado": "Procedimientos de actuación"
  },
  {
    "id": "CPEI-T28-OF-35867DD2",
    "orden": 170,
    "concepto": "Según el RD 614/2001, en alta tensión, ¿qué trabajadores realizan las maniobras para dejar sin tensión la instalación?",
    "respuesta": "Trabajadores cualificados",
    "fuente": "RD 614/2001, anexo II.A. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#anii",
    "localizacion": "RD 614/2001, anexo II.A",
    "apartado": "Procedimientos de actuación"
  },
  {
    "id": "CPEI-T28-OF-10C1A47E",
    "orden": 180,
    "concepto": "Según el RD 614/2001, en todo trabajo en proximidad, ¿dónde debe permanecer el trabajador?",
    "respuesta": "Fuera de la zona de peligro y lo más alejado de ella que el trabajo permita",
    "fuente": "RD 614/2001, anexo V.A. BOE-A-2001-11881, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2001-11881#anv",
    "localizacion": "RD 614/2001, anexo V.A",
    "apartado": "Procedimientos de actuación"
  },
  {
    "id": "CPEI-T28-OF-D38C2AA1",
    "orden": 190,
    "concepto": "Según el REBT, ¿hasta qué tensión nominal en corriente alterna se aplica el REBT?",
    "respuesta": "Igual o inferior a 1.000 voltios",
    "fuente": "REBT (RD 842/2002), Artículo 2. Campo de aplicación, art. 2.1.a). BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#a2",
    "localizacion": "REBT (RD 842/2002), Artículo 2. Campo de aplicación, art. 2.1.a)",
    "apartado": "Redes, líneas e instalaciones de enlace"
  },
  {
    "id": "CPEI-T28-OF-2AF5AEE1",
    "orden": 200,
    "concepto": "Según el REBT, ¿hasta qué tensión nominal en corriente continua se aplica el REBT?",
    "respuesta": "Igual o inferior a 1.500 voltios",
    "fuente": "REBT (RD 842/2002), Artículo 2. Campo de aplicación, art. 2.1.b). BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#a2",
    "localizacion": "REBT (RD 842/2002), Artículo 2. Campo de aplicación, art. 2.1.b)",
    "apartado": "Redes, líneas e instalaciones de enlace"
  },
  {
    "id": "CPEI-T28-OF-A7C0078A",
    "orden": 210,
    "concepto": "Según el REBT, en redes trifásicas de 4 conductores, ¿qué tensiones nominales se usan?",
    "respuesta": "230 V entre fase y neutro, y 400 V entre fases",
    "fuente": "REBT (RD 842/2002), Artículo 4. Clasificación de las tensiones. Frecuencia de las redes, art. 4.2.b). BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#a4",
    "localizacion": "REBT (RD 842/2002), Artículo 4. Clasificación de las tensiones. Frecuencia de las redes, art. 4.2.b)",
    "apartado": "Redes, líneas e instalaciones de enlace"
  },
  {
    "id": "CPEI-T28-OF-44770BE0",
    "orden": 220,
    "concepto": "Según el REBT, ¿qué frecuencia se emplea en la red?",
    "respuesta": "50 Hz",
    "fuente": "REBT (RD 842/2002), Artículo 4. Clasificación de las tensiones. Frecuencia de las redes, art. 4.4. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#a4",
    "localizacion": "REBT (RD 842/2002), Artículo 4. Clasificación de las tensiones. Frecuencia de las redes, art. 4.4",
    "apartado": "Redes, líneas e instalaciones de enlace"
  },
  {
    "id": "CPEI-T28-OF-DF2C5D1C",
    "orden": 230,
    "concepto": "Según el REBT, ¿qué es la acometida?",
    "respuesta": "La parte de la instalación de la red de distribución que alimenta la caja o cajas generales de protección o unidad funcional equivalente",
    "fuente": "REBT (RD 842/2002), Artículo 15. Acometidas e instalaciones de enlace, art. 15.1. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#a1-7",
    "localizacion": "REBT (RD 842/2002), Artículo 15. Acometidas e instalaciones de enlace, art. 15.1",
    "apartado": "Redes, líneas e instalaciones de enlace"
  },
  {
    "id": "CPEI-T28-OF-782667FD",
    "orden": 240,
    "concepto": "Según el REBT, ¿qué son las instalaciones de enlace?",
    "respuesta": "Las que unen la caja general de protección, o cajas generales de protección, incluidas éstas, con las instalaciones interiores o receptoras del usuario",
    "fuente": "REBT (RD 842/2002), Artículo 15. Acometidas e instalaciones de enlace, art. 15.2. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#a1-7",
    "localizacion": "REBT (RD 842/2002), Artículo 15. Acometidas e instalaciones de enlace, art. 15.2",
    "apartado": "Redes, líneas e instalaciones de enlace"
  },
  {
    "id": "CPEI-T28-OF-6E0C352D",
    "orden": 250,
    "concepto": "Según el REBT, ¿de qué se componen las instalaciones de enlace?",
    "respuesta": "Caja general de protección, línea general de alimentación, elementos para la ubicación de contadores, derivación individual, caja para interruptor de control de potencia y dispositivos generales de mando y protección",
    "fuente": "REBT (RD 842/2002), Artículo 15. Acometidas e instalaciones de enlace, art. 15.2. BOE-A-2002-18099, texto consolidado (últ. actualización 18/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099#a1-7",
    "localizacion": "REBT (RD 842/2002), Artículo 15. Acometidas e instalaciones de enlace, art. 15.2",
    "apartado": "Redes, líneas e instalaciones de enlace"
  },
  {
    "id": "CPEI-T28-OF-B263E48B",
    "orden": 260,
    "concepto": "Según el Reglamento de líneas de alta tensión, ¿qué líneas son de categoría especial?",
    "respuesta": "Las de tensión nominal igual o superior a 220 kV y las de tensión inferior que formen parte de la red de transporte",
    "fuente": "RD 223/2008 (líneas de alta tensión), Artículo 3. Tensiones nominales. Categorías de las líneas, art. 3.a). BOE-A-2008-5269, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2008-5269#a3",
    "localizacion": "RD 223/2008 (líneas de alta tensión), Artículo 3. Tensiones nominales. Categorías de las líneas, art. 3.a)",
    "apartado": "Redes, líneas e instalaciones de enlace"
  },
  {
    "id": "CPEI-T28-OF-4A35342D",
    "orden": 270,
    "concepto": "Según el Reglamento de líneas de alta tensión, ¿qué tensión nominal tienen las líneas de primera categoría?",
    "respuesta": "Inferior a 220 kV y superior a 66 kV",
    "fuente": "RD 223/2008 (líneas de alta tensión), Artículo 3. Tensiones nominales. Categorías de las líneas, art. 3.b). BOE-A-2008-5269, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2008-5269#a3",
    "localizacion": "RD 223/2008 (líneas de alta tensión), Artículo 3. Tensiones nominales. Categorías de las líneas, art. 3.b)",
    "apartado": "Redes, líneas e instalaciones de enlace"
  },
  {
    "id": "CPEI-T28-OF-09ACE942",
    "orden": 280,
    "concepto": "Según el Reglamento de líneas de alta tensión, ¿qué tensión nominal tienen las líneas de segunda categoría?",
    "respuesta": "Igual o inferior a 66 kV y superior a 30 kV",
    "fuente": "RD 223/2008 (líneas de alta tensión), Artículo 3. Tensiones nominales. Categorías de las líneas, art. 3.c). BOE-A-2008-5269, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2008-5269#a3",
    "localizacion": "RD 223/2008 (líneas de alta tensión), Artículo 3. Tensiones nominales. Categorías de las líneas, art. 3.c)",
    "apartado": "Redes, líneas e instalaciones de enlace"
  },
  {
    "id": "CPEI-T28-OF-1736B16C",
    "orden": 290,
    "concepto": "Según el Reglamento de líneas de alta tensión, ¿qué tensión nominal tienen las líneas de tercera categoría?",
    "respuesta": "Igual o inferior a 30 kV y superior a 1 kV",
    "fuente": "RD 223/2008 (líneas de alta tensión), Artículo 3. Tensiones nominales. Categorías de las líneas, art. 3.d). BOE-A-2008-5269, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2008-5269#a3",
    "localizacion": "RD 223/2008 (líneas de alta tensión), Artículo 3. Tensiones nominales. Categorías de las líneas, art. 3.d)",
    "apartado": "Redes, líneas e instalaciones de enlace"
  }
];
