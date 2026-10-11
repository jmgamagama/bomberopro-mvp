/** Tema 33 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (BOE-A-2017-6606). Calidad: data/tema33/tema33_calidad.md. */

export type Tema33RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA33_RECALL_META = {
  "tema": 33,
  "title": "Tema 33 · RIPCI (RD 513/2017): abastecimiento de agua, hidrantes, BIE y columna seca",
  "count": 67,
  "source": "Fase 2 · texto consolidado BOE-A-2017-6606 (arts. 1-2 y anexo I, apdos. 2, 3, 5 y 6; últ. act. 03/09/2025)"
} as const;

export const TEMA33_RECALL_CARDS: Tema33RecallCard[] = [
  {
    "id": "CPEI-T33-OF-B3CB2527",
    "orden": 10,
    "concepto": "Según el art. 1.1 del RIPCI, ¿qué constituye el objeto del Reglamento?",
    "respuesta": "La determinación de las condiciones y los requisitos exigibles al diseño, instalación/aplicación, mantenimiento e inspección de los equipos, sistemas y componentes que conforman las instalaciones de protección activa contra incendios",
    "fuente": "RD 513/2017 (RIPCI), Artículo 1. Objeto y ámbito de aplicación material, apdo. 1. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#a1",
    "localizacion": "RD 513/2017 (RIPCI), Artículo 1. Objeto y ámbito de aplicación material, apdo. 1",
    "apartado": "Objeto y ámbito"
  },
  {
    "id": "CPEI-T33-OF-115BF8C8",
    "orden": 20,
    "concepto": "Según el art. 1.2 del RIPCI, ¿con qué carácter se aplica el Reglamento a las instalaciones no reguladas en legislaciones específicas?",
    "respuesta": "Con carácter supletorio",
    "fuente": "RD 513/2017 (RIPCI), Artículo 1. Objeto y ámbito de aplicación material, apdo. 2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#a1",
    "localizacion": "RD 513/2017 (RIPCI), Artículo 1. Objeto y ámbito de aplicación material, apdo. 2",
    "apartado": "Objeto y ámbito"
  },
  {
    "id": "CPEI-T33-OF-AEA05BD4",
    "orden": 30,
    "concepto": "Según el art. 1.2 del RIPCI, ¿qué instalaciones se exceptúan de su aplicación supletoria?",
    "respuesta": "Los túneles de carreteras del Estado",
    "fuente": "RD 513/2017 (RIPCI), Artículo 1. Objeto y ámbito de aplicación material, apdo. 2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#a1",
    "localizacion": "RD 513/2017 (RIPCI), Artículo 1. Objeto y ámbito de aplicación material, apdo. 2",
    "apartado": "Objeto y ámbito"
  },
  {
    "id": "CPEI-T33-OF-3D1D9C91",
    "orden": 40,
    "concepto": "Según el art. 1.2 del RIPCI, ¿por qué real decreto se rige la seguridad de los túneles de carreteras del Estado?",
    "respuesta": "Por el Real Decreto 635/2006, de 26 de mayo",
    "fuente": "RD 513/2017 (RIPCI), Artículo 1. Objeto y ámbito de aplicación material, apdo. 2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#a1",
    "localizacion": "RD 513/2017 (RIPCI), Artículo 1. Objeto y ámbito de aplicación material, apdo. 2",
    "apartado": "Objeto y ámbito"
  },
  {
    "id": "CPEI-T33-OF-481B993E",
    "orden": 50,
    "concepto": "Según el art. 2.1 del RIPCI, ¿qué empresas están sujetas a sus disposiciones?",
    "respuesta": "Tanto las empresas instaladoras como las empresas mantenedoras de instalaciones de protección contra incendios",
    "fuente": "RD 513/2017 (RIPCI), Artículo 2. Ámbito de aplicación subjetivo, apdo. 1. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#a2",
    "localizacion": "RD 513/2017 (RIPCI), Artículo 2. Ámbito de aplicación subjetivo, apdo. 1",
    "apartado": "Objeto y ámbito"
  },
  {
    "id": "CPEI-T33-OF-EEEF370E",
    "orden": 60,
    "concepto": "Según el art. 2.2 del RIPCI, ¿a quiénes se aplican además sus exigencias técnicas?",
    "respuesta": "A los fabricantes, importadores, distribuidores u organismos que intervengan en la certificación o evaluación técnica de los productos",
    "fuente": "RD 513/2017 (RIPCI), Artículo 2. Ámbito de aplicación subjetivo, apdo. 2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#a2",
    "localizacion": "RD 513/2017 (RIPCI), Artículo 2. Ámbito de aplicación subjetivo, apdo. 2",
    "apartado": "Objeto y ámbito"
  },
  {
    "id": "CPEI-T33-OF-3AFC8B90",
    "orden": 70,
    "concepto": "Según el anexo I del RIPCI, ¿por qué está formado el sistema de abastecimiento de agua contra incendios?",
    "respuesta": "Por un conjunto de fuentes de agua, equipos de impulsión y una red general de incendios",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 2",
    "apartado": "Abastecimiento de agua"
  },
  {
    "id": "CPEI-T33-OF-39ACA28F",
    "orden": 80,
    "concepto": "Según el anexo I del RIPCI, ¿qué debe asegurar el sistema de abastecimiento de agua contra incendios?",
    "respuesta": "El caudal y presión de agua necesarios durante el tiempo de autonomía requerido",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 2",
    "apartado": "Abastecimiento de agua"
  },
  {
    "id": "CPEI-T33-OF-EF3D3112",
    "orden": 90,
    "concepto": "Según el anexo I del RIPCI, ¿a qué norma UNE se ajustan las características de los sistemas de abastecimiento de agua contra incendios?",
    "respuesta": "La norma UNE 23500",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 2",
    "apartado": "Abastecimiento de agua"
  },
  {
    "id": "CPEI-T33-OF-96532BB4",
    "orden": 100,
    "concepto": "Según el anexo I del RIPCI, ¿de qué están compuestos los sistemas de hidrantes contra incendios?",
    "respuesta": "Por una red de tuberías para agua de alimentación y los hidrantes necesarios",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.1. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.1",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-2C1340B5",
    "orden": 110,
    "concepto": "Según el anexo I del RIPCI, ¿de qué dos tipos serán los hidrantes contra incendios?",
    "respuesta": "Del tipo de columna o bajo tierra",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.1. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.1",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-20DC82A9",
    "orden": 120,
    "concepto": "Según el anexo I del RIPCI, ¿conforme a qué norma llevan el marcado CE los hidrantes de columna?",
    "respuesta": "La norma UNE-EN 14384",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.2",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-4E6928CA",
    "orden": 130,
    "concepto": "Según el anexo I del RIPCI, ¿conforme a qué norma llevan el marcado CE los hidrantes bajo tierra?",
    "respuesta": "La norma UNE-EN 14339",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.2",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-A3A46BC0",
    "orden": 140,
    "concepto": "Según el anexo I del RIPCI, ¿qué tipo de hidrante de columna se admite cuando se prevean riesgos de heladas?",
    "respuesta": "Solo se admitirán los de tipo «C»",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.2",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-C906FF9E",
    "orden": 150,
    "concepto": "Según el anexo I del RIPCI, ¿qué PFA deben tener los hidrantes bajo tierra?",
    "respuesta": "PFA de 1600 kPa (16 kg/cm2)",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.2",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-CC3497D5",
    "orden": 160,
    "concepto": "Según el anexo I del RIPCI, ¿qué distancia de recorrido real máxima a un hidrante se exige en zonas urbanas?",
    "respuesta": "Inferior a 100 m",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.3.a. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.3.a",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-6E6CBF26",
    "orden": 170,
    "concepto": "Según el anexo I del RIPCI, fuera de las zonas urbanas, ¿qué distancia de recorrido real máxima a un hidrante se exige?",
    "respuesta": "40 m",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.3.a. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.3.a",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-C8ED7685",
    "orden": 180,
    "concepto": "Según el anexo I del RIPCI, ¿qué salida debe tener al menos uno de los hidrantes de una zona protegida?",
    "respuesta": "Una salida de 100 mm, orientada perpendicular a la fachada y de espaldas a la misma",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.3.b. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.3.b",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-7142C0E8",
    "orden": 190,
    "concepto": "Según el anexo I del RIPCI, en hidrantes fuera de la vía pública, ¿entre qué distancias del límite exterior del edificio deben situarse?",
    "respuesta": "Entre 5 m y 15 m",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.3.c. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.3.c",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-FB44017D",
    "orden": 200,
    "concepto": "Según el anexo I del RIPCI, ¿cuál es el caudal ininterrumpido mínimo por cada boca de hidrante?",
    "respuesta": "500 l/min",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.3. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.3",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-BC760DF4",
    "orden": 210,
    "concepto": "Según el anexo I del RIPCI, en zonas urbanas con hidrantes solo para llenado de camiones, ¿qué presión mínima se exige en la boca de salida?",
    "respuesta": "100 kPa (1 kg/cm2)",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.3. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.3",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-3A91AB11",
    "orden": 220,
    "concepto": "Según el anexo I del RIPCI, salvo los de llenado de camiones en zona urbana, ¿qué presión mínima se exige en la boca de salida del hidrante?",
    "respuesta": "500 kPa (5 kg/cm2)",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.3. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.3",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-E6D22DD0",
    "orden": 230,
    "concepto": "Según el anexo I del RIPCI, si los hidrantes de llenado de camiones disponen de depósitos, ¿qué autonomía mínima deben garantizar?",
    "respuesta": "Una autonomía de, al menos, 60 minutos",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.4. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.4",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-EF2A611C",
    "orden": 240,
    "concepto": "Según el anexo I del RIPCI, ¿con qué llave de cuadradillo se accionan los hidrantes bajo tierra?",
    "respuesta": "Llave de cuadradillo de 25 mm x 25 mm",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.5. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.5",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-A0C68B54",
    "orden": 250,
    "concepto": "Según el anexo I del RIPCI, ¿con qué llave de cuadradillo se accionan los hidrantes de columna?",
    "respuesta": "De 30 mm x 30 mm",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.5. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.5",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-2118617C",
    "orden": 260,
    "concepto": "Según el anexo I del RIPCI, ¿en qué sentido se gira el mecanismo del hidrante para cerrar?",
    "respuesta": "En el sentido de las agujas del reloj",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.5. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.5",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-97CD870D",
    "orden": 270,
    "concepto": "Según el anexo I del RIPCI, ¿de qué color deben estar preferentemente pintadas las tapas de los hidrantes bajo tierra?",
    "respuesta": "De color rojo (RAL 3001 o equivalente)",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.5. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.5",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-8376F637",
    "orden": 280,
    "concepto": "Según el anexo I del RIPCI, en los hidrantes municipales, ¿quién determina la puesta en servicio, mantenimiento e inspecciones?",
    "respuesta": "El propio municipio o Administración pública correspondiente",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.6. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 3.6",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T33-OF-69046BB6",
    "orden": 290,
    "concepto": "Según el anexo I del RIPCI, ¿con qué dos tipos de manguera pueden estar equipadas las BIE?",
    "respuesta": "Con manguera plana o con manguera semirrígida",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.1. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.1",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-83F1AB78",
    "orden": 300,
    "concepto": "Según el anexo I del RIPCI, ¿de qué diámetro es la toma adicional de las BIE con manguera semirrígida para los servicios profesionales de extinción?",
    "respuesta": "45 mm",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.1. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.1",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-BD50FA2C",
    "orden": 310,
    "concepto": "Según el anexo I del RIPCI, ¿conforme a qué normas llevan el marcado CE las BIE con manguera semirrígida y con manguera plana?",
    "respuesta": "UNE-EN 671-1 y UNE EN 671-2, respectivamente",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.2",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-C6C2AEDF",
    "orden": 320,
    "concepto": "Según el anexo I del RIPCI, ¿qué diámetro interior se admite para las mangueras semirrígidas de las BIE?",
    "respuesta": "25 milímetros",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.2",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-2F82912A",
    "orden": 330,
    "concepto": "Según el anexo I del RIPCI, ¿qué diámetro interior se admite para las mangueras planas de las BIE?",
    "respuesta": "45 milímetros",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.2",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-6ED0D4A9",
    "orden": 340,
    "concepto": "Según el anexo I del RIPCI, ¿cuál es el factor K mínimo de las BIE con manguera semirrígida?",
    "respuesta": "42",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.2",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-4DF59490",
    "orden": 350,
    "concepto": "Según el anexo I del RIPCI, ¿cuál es el factor K mínimo de las BIE con manguera plana?",
    "respuesta": "85",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.2",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-6413E946",
    "orden": 360,
    "concepto": "Según el anexo I del RIPCI, ¿qué diámetro interior nominal máximo tienen las mangueras de las BIE de alta presión?",
    "respuesta": "No superior a 12 mm",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.2",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-1E182BD8",
    "orden": 370,
    "concepto": "Según el anexo I del RIPCI, ¿a qué altura máxima sobre el suelo deben estar la boquilla, la válvula y la apertura del armario de la BIE?",
    "respuesta": "Como máximo, a 1,50 m",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.3. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.3",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-EAA7F060",
    "orden": 380,
    "concepto": "Según el anexo I del RIPCI, ¿a qué distancia máxima de cada salida de sector de incendio se situará siempre una BIE?",
    "respuesta": "A una distancia máxima de 5 metros",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.3. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.3",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-D948BD6F",
    "orden": 390,
    "concepto": "Según el anexo I del RIPCI, ¿cómo se calcula el radio de acción de una BIE?",
    "respuesta": "La longitud de su manguera incrementada en 5 m",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.3. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.3",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-48D1BBE8",
    "orden": 400,
    "concepto": "Según el anexo I del RIPCI, ¿cuál es la separación máxima entre una BIE con manguera semirrígida o plana y su más cercana?",
    "respuesta": "50 m",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.3. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.3",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-C3274FFD",
    "orden": 410,
    "concepto": "Según el anexo I del RIPCI, ¿cuál es la longitud máxima de la manguera de las BIE con manguera plana?",
    "respuesta": "20 m",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.3. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.3",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-A39E7771",
    "orden": 420,
    "concepto": "Según el anexo I del RIPCI, ¿cuál es la longitud máxima de la manguera de las BIE con manguera semirrígida?",
    "respuesta": "30 m",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.3. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.3",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-A852359D",
    "orden": 430,
    "concepto": "Según el anexo I del RIPCI, ¿durante cuánto tiempo mínimo debe la red de BIE asegurar el caudal de las dos hidráulicamente más desfavorables?",
    "respuesta": "Durante una hora como mínimo",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.4. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.4",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-FCED4E14",
    "orden": 440,
    "concepto": "Según el anexo I del RIPCI, ¿qué caudal mínimo debe proporcionar una BIE con manguera semirrígida (25 mm)?",
    "respuesta": "85 litros/minuto",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.4.a. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.4.a",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-0909D83A",
    "orden": 450,
    "concepto": "Según el anexo I del RIPCI, ¿qué presión mínima a la entrada implica una BIE de 25 mm con K=42?",
    "respuesta": "4 bar (400 kPa)",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.4.a. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.4.a",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-A2C77C86",
    "orden": 460,
    "concepto": "Según el anexo I del RIPCI, ¿qué caudal mínimo debe proporcionar una BIE con manguera plana (45 mm)?",
    "respuesta": "160 litros/minuto",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.4.b. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.4.b",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-9BC77121",
    "orden": 470,
    "concepto": "Según el anexo I del RIPCI, ¿qué presión mínima a la entrada implica una BIE de 45 mm con K=85?",
    "respuesta": "3,5 bar (350 kPa)",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.4.b. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.4.b",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-2E61EF47",
    "orden": 480,
    "concepto": "Según el anexo I del RIPCI, ¿qué presión máxima a la entrada no debe superar una BIE con manguera semirrígida o plana?",
    "respuesta": "9 bar (900 kPa)",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.4.c. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.4.c",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-F3D66BFF",
    "orden": 490,
    "concepto": "Según el anexo I del RIPCI, ¿qué presión dinámica mínima debe dar la red de BIE de alta presión en el orificio de salida?",
    "respuesta": "3.450 kPa (35 kg/cm2)",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.4. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.4",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-D1564003",
    "orden": 500,
    "concepto": "Según el anexo I del RIPCI, ¿a qué presión mínima se somete la red de BIE con manguera semirrígida o plana en la prueba de estanquidad?",
    "respuesta": "980 kPa (10 kg/cm2)",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.5. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.5",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-FBAC52F0",
    "orden": 510,
    "concepto": "Según el anexo I del RIPCI, ¿durante cuánto tiempo mínimo se mantiene la presión en la prueba de estanquidad de la red de BIE?",
    "respuesta": "Durante dos horas, como mínimo",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.5. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.5",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-27C6A156",
    "orden": 520,
    "concepto": "Según el anexo I del RIPCI, ¿a qué presión se prueba la red de BIE de alta presión?",
    "respuesta": "1,5 veces la presión de trabajo máxima",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.5. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.5",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-A65D7A06",
    "orden": 530,
    "concepto": "Según el anexo I del RIPCI, ¿dónde se coloca la señalización de la BIE?",
    "respuesta": "Inmediatamente junto al armario de la BIE y no sobre el mismo",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.6. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 5.6",
    "apartado": "BIE"
  },
  {
    "id": "CPEI-T33-OF-4B26FDBF",
    "orden": 540,
    "concepto": "Según el anexo I del RIPCI, ¿qué indicación lleva la toma de agua en fachada de la columna seca?",
    "respuesta": "«USO EXCLUSIVO SERVICIOS DE EXTINCIÓN DE INCENDIOS»",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.1.a. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.1.a",
    "apartado": "Columna seca"
  },
  {
    "id": "CPEI-T33-OF-72B62BED",
    "orden": 550,
    "concepto": "Según el anexo I del RIPCI, ¿de qué diámetro son los racores de la toma de agua en fachada de la columna seca?",
    "respuesta": "Racores de 70 mm",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.1.a. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.1.a",
    "apartado": "Columna seca"
  },
  {
    "id": "CPEI-T33-OF-53BAC87E",
    "orden": 560,
    "concepto": "Según el anexo I del RIPCI, ¿de qué tubería es la columna seca?",
    "respuesta": "De tubería de acero galvanizado DN80",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.1.b. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.1.b",
    "apartado": "Columna seca"
  },
  {
    "id": "CPEI-T33-OF-568D02CE",
    "orden": 570,
    "concepto": "Según el anexo I del RIPCI, ¿en qué plantas tienen salidas las columnas secas ascendentes?",
    "respuesta": "En las plantas pares hasta la octava y en todas a partir de ésta",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.1.b. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.1.b",
    "apartado": "Columna seca"
  },
  {
    "id": "CPEI-T33-OF-7D06030F",
    "orden": 580,
    "concepto": "Según el anexo I del RIPCI, en las columnas secas ascendentes, ¿cada cuántas plantas se instala una válvula de seccionamiento?",
    "respuesta": "Cada cuatro plantas",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.1.b. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.1.b",
    "apartado": "Columna seca"
  },
  {
    "id": "CPEI-T33-OF-4D43B929",
    "orden": 590,
    "concepto": "Según el anexo I del RIPCI, ¿de qué diámetro son los racores de las salidas de planta de la columna seca?",
    "respuesta": "Racores de 45 mm con tapa",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.1.b. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.1.b",
    "apartado": "Columna seca"
  },
  {
    "id": "CPEI-T33-OF-0A3832D1",
    "orden": 600,
    "concepto": "Según el anexo I del RIPCI, ¿dónde estarán situadas las bocas de salida de la columna seca?",
    "respuesta": "En recintos de escaleras o en vestíbulos previos a ellas",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.2",
    "apartado": "Columna seca"
  },
  {
    "id": "CPEI-T33-OF-60810479",
    "orden": 610,
    "concepto": "Según el anexo I del RIPCI, ¿a qué altura sobre el suelo tienen el centro de sus bocas la toma exterior y las salidas de planta de la columna seca?",
    "respuesta": "A 0,90 m sobre el nivel del suelo",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.2",
    "apartado": "Columna seca"
  },
  {
    "id": "CPEI-T33-OF-BC3BFDC3",
    "orden": 620,
    "concepto": "Según el anexo I del RIPCI, ¿de qué tipo son las válvulas de la columna seca?",
    "respuesta": "De bola, con palanca de accionamiento incorporada",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.2. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.2",
    "apartado": "Columna seca"
  },
  {
    "id": "CPEI-T33-OF-22DB3D19",
    "orden": 630,
    "concepto": "Según el anexo I del RIPCI, ¿qué recorrido máximo hasta una columna seca debe haber en cada edificio?",
    "respuesta": "Menor de 60 metros",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.3. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.3",
    "apartado": "Columna seca"
  },
  {
    "id": "CPEI-T33-OF-09795711",
    "orden": 640,
    "concepto": "Según el anexo I del RIPCI, ¿para qué se reserva un emplazamiento señalizado junto a la toma de fachada de la columna seca?",
    "respuesta": "Para el camión de bombeo",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.3. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.3",
    "apartado": "Columna seca"
  },
  {
    "id": "CPEI-T33-OF-81B6B113",
    "orden": 650,
    "concepto": "Según el anexo I del RIPCI, ¿a qué presión mínima se prueban las columnas secas de hasta 30 m?",
    "respuesta": "1470 kPa (15 kg/cm2)",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.4. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.4",
    "apartado": "Columna seca"
  },
  {
    "id": "CPEI-T33-OF-E12A3B12",
    "orden": 660,
    "concepto": "Según el anexo I del RIPCI, ¿a qué presión mínima se prueban las columnas secas de más de 30 m de altura?",
    "respuesta": "2.450 kPa (25 kg/cm2)",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.4. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.4",
    "apartado": "Columna seca"
  },
  {
    "id": "CPEI-T33-OF-F5DEB69F",
    "orden": 670,
    "concepto": "Según el anexo I del RIPCI, ¿qué se identificará en las tomas de entrada de la columna seca?",
    "respuesta": "Las plantas o zonas a las que da servicio cada toma de agua, así como la presión máxima de servicio",
    "fuente": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.5. BOE-A-2017-6606, texto consolidado (últ. actualización 03/09/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RD 513/2017 (RIPCI), Sección 1.ª Protección activa contra incendios, anexo I, 6.5",
    "apartado": "Columna seca"
  }
];
