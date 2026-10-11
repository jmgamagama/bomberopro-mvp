/** Tema 10 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (BOE-A-2017-6606). Calidad: data/tema10/tema10_calidad.md. */

export type Tema10RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA10_RECALL_META = {
  "tema": 10,
  "title": "Tema 10 · Abastecimiento de agua, hidrantes, BIE y columnas secas (RIPCI)",
  "count": 34,
  "source": "Fase 4 · RD 513/2017, RIPCI (BOE-A-2017-6606), últ. act. 19/12/2025, anexo I sección 1.ª"
} as const;

export const TEMA10_RECALL_CARDS: Tema10RecallCard[] = [
  {
    "id": "CPEI-T10-OF-706CD1A2",
    "orden": 10,
    "concepto": "Según el RIPCI, ¿por qué está formado el sistema de abastecimiento de agua contra incendios?",
    "respuesta": "Por un conjunto de fuentes de agua, equipos de impulsión y una red general de incendios",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 2. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 2",
    "apartado": "Abastecimiento de agua"
  },
  {
    "id": "CPEI-T10-OF-29EE0B1A",
    "orden": 20,
    "concepto": "Según el RIPCI, ¿a qué norma se ajusta el sistema de abastecimiento de agua contra incendios?",
    "respuesta": "UNE 23500",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 2. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 2",
    "apartado": "Abastecimiento de agua"
  },
  {
    "id": "CPEI-T10-OF-8E92BEA0",
    "orden": 30,
    "concepto": "Según el RIPCI, ¿de qué tipos serán los hidrantes contra incendios?",
    "respuesta": "Del tipo de columna o bajo tierra",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.1. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.1",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T10-OF-F2F4D17C",
    "orden": 40,
    "concepto": "Según el RIPCI, ¿qué tipo de hidrante de columna se admite cuando se prevean riesgos de heladas?",
    "respuesta": "Solo se admitirán los de tipo «C»",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.2. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.2",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T10-OF-E78E75F4",
    "orden": 50,
    "concepto": "Según el RIPCI, ¿qué PFA deben tener los hidrantes bajo tierra?",
    "respuesta": "PFA de 1600 kPa (16 kg/cm2)",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.2. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.2",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T10-OF-5B510820",
    "orden": 60,
    "concepto": "Según el RIPCI, ¿qué distancia de recorrido real máxima a un hidrante se exige en zonas urbanas?",
    "respuesta": "Inferior a 100 m",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.3.a). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.3.a)",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T10-OF-9124B75C",
    "orden": 70,
    "concepto": "Según el RIPCI, ¿qué distancia de recorrido real máxima a un hidrante se exige fuera de zonas urbanas?",
    "respuesta": "40 m",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.3.a). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.3.a)",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T10-OF-D2DDA74A",
    "orden": 80,
    "concepto": "Según el RIPCI, ¿qué salida debe tener al menos uno de los hidrantes de la zona protegida?",
    "respuesta": "Una salida de 100 mm",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.3.b). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.3.b)",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T10-OF-FC96BCDC",
    "orden": 90,
    "concepto": "Según el RIPCI, ¿entre qué distancias de la fachada deben situarse los hidrantes que no estén en la vía pública?",
    "respuesta": "Entre 5 m y 15 m",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.3.c). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.3.c)",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T10-OF-A0B7C4C8",
    "orden": 100,
    "concepto": "Según el RIPCI, ¿qué caudal ininterrumpido mínimo debe suministrar cada boca de hidrante?",
    "respuesta": "500 l/min",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.3. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.3",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T10-OF-B2B43F79",
    "orden": 110,
    "concepto": "Según el RIPCI, ¿qué presión mínima en la boca se exige a un hidrante urbano destinado únicamente al llenado de camiones?",
    "respuesta": "100 kPa (1 kg/cm2)",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.3. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.3",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T10-OF-5E2D8940",
    "orden": 120,
    "concepto": "Según el RIPCI, fuera de ese caso, ¿qué presión mínima se exige en la boca de salida del hidrante?",
    "respuesta": "500 kPa (5 kg/cm2)",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.3. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.3",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T10-OF-08CDE396",
    "orden": 130,
    "concepto": "Según el RIPCI, ¿qué autonomía mínima deben garantizar los depósitos de hidrantes para llenado de camiones?",
    "respuesta": "Al menos, 60 minutos",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.4. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.4",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T10-OF-A2066548",
    "orden": 140,
    "concepto": "Según el RIPCI, ¿con qué llave de cuadradillo se acciona un hidrante de columna?",
    "respuesta": "De 30 mm x 30 mm",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.5. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.5",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T10-OF-025B4A7D",
    "orden": 150,
    "concepto": "Según el RIPCI, ¿de qué color deben estar preferentemente pintadas las tapas de los hidrantes bajo tierra?",
    "respuesta": "De color rojo (RAL 3001 o equivalente)",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.5. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 3.5",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T10-OF-4F9E0B58",
    "orden": 160,
    "concepto": "Según el RIPCI, ¿qué diámetro interior se admite para las mangueras semirrígidas de BIE?",
    "respuesta": "25 milímetros",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.2. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.2",
    "apartado": "Bocas de incendio equipadas"
  },
  {
    "id": "CPEI-T10-OF-C810C7ED",
    "orden": 170,
    "concepto": "Según el RIPCI, ¿qué diámetro interior se admite para las mangueras planas de BIE?",
    "respuesta": "45 milímetros",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.2. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.2",
    "apartado": "Bocas de incendio equipadas"
  },
  {
    "id": "CPEI-T10-OF-2A6ECDCE",
    "orden": 180,
    "concepto": "Según el RIPCI, ¿a qué altura máxima sobre el suelo se sitúan la boquilla y la válvula de la BIE?",
    "respuesta": "A 1,50 m",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.3. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.3",
    "apartado": "Bocas de incendio equipadas"
  },
  {
    "id": "CPEI-T10-OF-3AE8178B",
    "orden": 190,
    "concepto": "Según el RIPCI, ¿a qué distancia máxima de cada salida de sector se situará siempre una BIE?",
    "respuesta": "5 metros",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.3. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.3",
    "apartado": "Bocas de incendio equipadas"
  },
  {
    "id": "CPEI-T10-OF-1A5D7B02",
    "orden": 200,
    "concepto": "Según el RIPCI, ¿cuál es el radio de acción de una BIE?",
    "respuesta": "La longitud de su manguera incrementada en 5 m",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.3. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.3",
    "apartado": "Bocas de incendio equipadas"
  },
  {
    "id": "CPEI-T10-OF-B0B27405",
    "orden": 210,
    "concepto": "Según el RIPCI, ¿cuál es la separación máxima entre una BIE (semirrígida o plana) y la más cercana?",
    "respuesta": "50 m",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.3. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.3",
    "apartado": "Bocas de incendio equipadas"
  },
  {
    "id": "CPEI-T10-OF-6D4AB67C",
    "orden": 220,
    "concepto": "Según el RIPCI, ¿cuál es la longitud máxima de manguera de una BIE con manguera plana?",
    "respuesta": "20 m",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.3. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.3",
    "apartado": "Bocas de incendio equipadas"
  },
  {
    "id": "CPEI-T10-OF-95671BCB",
    "orden": 230,
    "concepto": "Según el RIPCI, ¿cuál es la longitud máxima de manguera de una BIE con manguera semirrígida?",
    "respuesta": "30 m",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.3. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.3",
    "apartado": "Bocas de incendio equipadas"
  },
  {
    "id": "CPEI-T10-OF-66F14F42",
    "orden": 240,
    "concepto": "Según el RIPCI, ¿durante cuánto tiempo mínimo debe asegurar la red de BIE el caudal de las dos hidráulicamente más desfavorables?",
    "respuesta": "Durante una hora como mínimo",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.4. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.4",
    "apartado": "Bocas de incendio equipadas"
  },
  {
    "id": "CPEI-T10-OF-4430182E",
    "orden": 250,
    "concepto": "Según el RIPCI, ¿qué caudal mínimo debe proporcionar una BIE con manguera semirrígida (25 mm)?",
    "respuesta": "85 litros/minuto",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.4.a). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.4.a)",
    "apartado": "Bocas de incendio equipadas"
  },
  {
    "id": "CPEI-T10-OF-C21A4129",
    "orden": 260,
    "concepto": "Según el RIPCI, ¿qué caudal mínimo debe proporcionar una BIE con manguera plana (45 mm)?",
    "respuesta": "160 litros/minuto",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.4.b). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.4.b)",
    "apartado": "Bocas de incendio equipadas"
  },
  {
    "id": "CPEI-T10-OF-9A66DFEA",
    "orden": 270,
    "concepto": "Según el RIPCI, ¿qué presión máxima a la entrada no debe superar una BIE semirrígida o plana?",
    "respuesta": "9 bar (900 kPa)",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.4.c). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.4.c)",
    "apartado": "Bocas de incendio equipadas"
  },
  {
    "id": "CPEI-T10-OF-CEBDCA26",
    "orden": 280,
    "concepto": "Según el RIPCI, ¿durante cuánto tiempo se mantiene la presión en la prueba de estanquidad de la red de BIE?",
    "respuesta": "Durante dos horas, como mínimo",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.5. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 5.5",
    "apartado": "Bocas de incendio equipadas"
  },
  {
    "id": "CPEI-T10-OF-321BC57B",
    "orden": 290,
    "concepto": "Según el RIPCI, ¿qué indicación lleva la toma de agua de la columna seca?",
    "respuesta": "«USO EXCLUSIVO SERVICIOS DE EXTINCIÓN DE INCENDIOS»",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 6.1.a). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 6.1.a)",
    "apartado": "Columnas secas"
  },
  {
    "id": "CPEI-T10-OF-A14F64EE",
    "orden": 300,
    "concepto": "Según el RIPCI, ¿de qué diámetro son los racores de la toma de fachada de la columna seca?",
    "respuesta": "Racores de 70 mm",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 6.1.a). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 6.1.a)",
    "apartado": "Columnas secas"
  },
  {
    "id": "CPEI-T10-OF-8B67C299",
    "orden": 310,
    "concepto": "Según el RIPCI, ¿de qué tubería es la columna seca?",
    "respuesta": "De acero galvanizado DN80",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 6.1.b). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 6.1.b)",
    "apartado": "Columnas secas"
  },
  {
    "id": "CPEI-T10-OF-B12706BB",
    "orden": 320,
    "concepto": "Según el RIPCI, en las columnas secas ascendentes, ¿en qué plantas hay salidas?",
    "respuesta": "En las plantas pares hasta la octava y en todas a partir de ésta",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 6.1.b). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 6.1.b)",
    "apartado": "Columnas secas"
  },
  {
    "id": "CPEI-T10-OF-9D9A93F3",
    "orden": 330,
    "concepto": "Según el RIPCI, en columnas secas ascendentes, ¿cada cuántas plantas se instala una válvula de seccionamiento?",
    "respuesta": "Cada cuatro plantas",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 6.1.b). BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 6.1.b)",
    "apartado": "Columnas secas"
  },
  {
    "id": "CPEI-T10-OF-4202FB44",
    "orden": 340,
    "concepto": "Según el RIPCI, ¿a qué altura sobre el suelo estará el centro de las bocas de la columna seca?",
    "respuesta": "A 0,90 m",
    "fuente": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 6.2. BOE-A-2017-6606, texto consolidado (últ. actualización 19/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606#s1-2",
    "localizacion": "RIPCI (RD 513/2017), Sección 1.ª Protección activa contra incendios, anexo I, 1.ª, 6.2",
    "apartado": "Columnas secas"
  }
];
