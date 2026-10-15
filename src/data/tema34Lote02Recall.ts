/** Tema 34 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (BOE-A-2025-7190). Calidad: data/tema34/tema34_lote02_calidad.md. */

export type Tema34RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA34_LOTE02_RECALL_META = {
  "tema": 34,
  "lote": "lote02",
  "title": "Tema 34 · RD 164/2025 (RSCIEI), lote 2: instalaciones de protección activa (anexo III)",
  "count": 39,
  "source": "Fase 3 · texto consolidado BOE-A-2025-7190 (reglamento, anexo III; últ. act. 20/12/2025)"
} as const;

export const TEMA34_LOTE02_RECALL_CARDS: Tema34RecallCard[] = [
  {
    "id": "CPEI-T34-OF-C6B75B69",
    "orden": 10,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿qué son los sistemas fijos de extinción automática?",
    "respuesta": "Aquellos sistemas de extinción de incendios cuya descarga del agente comienza por sí sola, sin intervención humana",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, Definiciones. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, Definiciones",
    "apartado": "Otras instalaciones"
  },
  {
    "id": "CPEI-T34-OF-94522841",
    "orden": 20,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿de qué dispositivos se componen los sistemas de detección y de alarma de incendios?",
    "respuesta": "Dispositivos para la activación automática (detectores) y/o dispositivos para la activación manual (pulsadores manuales de alarma), conectados a un equipo de control e indicación y a dispositivos de alarma",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.1",
    "apartado": "Detección y alarma"
  },
  {
    "id": "CPEI-T34-OF-9A77386F",
    "orden": 30,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), en fabricación con configuración AV o AH, ¿desde qué superficie del sector se exige detección automática y manual?",
    "respuesta": "Sectores con superficie construida de 300 m2 o superior",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.2",
    "apartado": "Detección y alarma"
  },
  {
    "id": "CPEI-T34-OF-4C044AB5",
    "orden": 40,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), en almacenamiento con configuración AV o AH, ¿desde qué superficie del sector se exige detección automática y manual?",
    "respuesta": "Sectores con superficie construida de 150 m2 o superior",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.2",
    "apartado": "Detección y alarma"
  },
  {
    "id": "CPEI-T34-OF-9CC1865F",
    "orden": 50,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), en fabricación con configuración B y riesgo alto, ¿desde qué superficie se exige detección automática y manual?",
    "respuesta": "Superficie construida de 1.000 m2 o superior",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.2",
    "apartado": "Detección y alarma"
  },
  {
    "id": "CPEI-T34-OF-CC600597",
    "orden": 60,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), en almacenamiento con configuración C y riesgo alto, ¿desde qué superficie se exige detección automática y manual?",
    "respuesta": "Superficie construida de 800 m2 o superior",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.2",
    "apartado": "Detección y alarma"
  },
  {
    "id": "CPEI-T34-OF-269AF165",
    "orden": 70,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), si no se exige detección automática, ¿desde qué superficie de sector se exigen al menos pulsadores manuales?",
    "respuesta": "Una superficie construida de 400 m2 o superior",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.3. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.3",
    "apartado": "Detección y alarma"
  },
  {
    "id": "CPEI-T34-OF-E517D6A1",
    "orden": 80,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿qué superficie total de sectores de un edificio, unida a una ocupación alta, obliga a instalar sistema de alarma por voz?",
    "respuesta": "10.000 m2 o superior",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.5. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.5",
    "apartado": "Detección y alarma"
  },
  {
    "id": "CPEI-T34-OF-FF113D4F",
    "orden": 90,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿qué densidad de ocupación, unida a 10.000 m2 de sectores, obliga a instalar sistema de alarma por voz?",
    "respuesta": "Superior a 3 personas por cada 100 m2",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.5. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 1.5",
    "apartado": "Detección y alarma"
  },
  {
    "id": "CPEI-T34-OF-1F9538AC",
    "orden": 100,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), en simultaneidad de hidrantes y rociadores, ¿qué porcentaje del caudal de hidrantes se suma al de rociadores?",
    "respuesta": "El 50 por ciento del requerido para los hidrantes",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 2.3.a).ii. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 2.3.a).ii",
    "apartado": "Abastecimiento de agua"
  },
  {
    "id": "CPEI-T34-OF-F1F438BC",
    "orden": 110,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿es obligatorio contemplar más de un foco de incendio para calcular el abastecimiento de agua?",
    "respuesta": "No es obligatorio contemplar la coincidencia de más de un foco de incendio en el establecimiento",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 2.3.b). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 2.3.b)",
    "apartado": "Abastecimiento de agua"
  },
  {
    "id": "CPEI-T34-OF-F48F8A9D",
    "orden": 120,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿qué dos tipos de hidrantes se diferencian?",
    "respuesta": "Hidrantes para el llenado de camiones e hidrantes de impulsión directa",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.1",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T34-OF-17F6D0F8",
    "orden": 130,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿a partir de qué superficie total del establecimiento se exige en todo caso al menos un hidrante para llenado de camiones?",
    "respuesta": "Igual o superior a 5.000 m2",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.2.2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.2.2",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T34-OF-76AADEAF",
    "orden": 140,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿cuál es la función principal de los hidrantes para el llenado de camiones?",
    "respuesta": "El llenado de los camiones cisterna de los Servicios de Extinción de Incendios y Salvamento",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.2.3. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.2.3",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T34-OF-EB8D7D86",
    "orden": 150,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿a qué distancia máxima de las entradas principales o fachadas accesibles deben situarse los hidrantes para llenado de camiones?",
    "respuesta": "A menos de 100 metros",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.2.3. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.2.3",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T34-OF-6E145E41",
    "orden": 160,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿qué presión mínima en boca de salida se exige al hidrante para llenado de camiones?",
    "respuesta": "100 kPa (1 kg/cm2)",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.2.4.b). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.2.4.b)",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T34-OF-11897EE8",
    "orden": 170,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿qué caudal mínimo y autonomía se exigen a la red de hidrantes para llenado de camiones?",
    "respuesta": "El caudal mínimo será de 500 l/min y el tiempo de autonomía mínimo de 60 minutos",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.2.4.b). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.2.4.b)",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T34-OF-BC587617",
    "orden": 180,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿pueden conectarse los hidrantes para llenado de camiones a la red pública sin depósito ni bombeo?",
    "respuesta": "Pueden estar conectados a la red pública de suministro de agua, sin necesidad de depósito ni de equipo de bombeo, cuando esta sea capaz de proporcionar la presión y el caudal requeridos",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.2.4.b). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.2.4.b)",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T34-OF-617B2547",
    "orden": 190,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿entre qué distancias a la fachada deben situarse, a ser posible, los hidrantes de impulsión directa?",
    "respuesta": "Entre 5 y 15 metros",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.3.2.c). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.3.2.c)",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T34-OF-CD070B89",
    "orden": 200,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿qué presión mínima en boca de salida se exige a los hidrantes de impulsión directa?",
    "respuesta": "500 kPa (5 kg/cm2)",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.3.2.f). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.3.2.f)",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T34-OF-AB0D0B39",
    "orden": 210,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿qué equipamiento debe disponer el establecimiento para usar los hidrantes de impulsión directa?",
    "respuesta": "Mangueras, lanzas, accesorios y herramientas que corresponda",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.3.2.e). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 3.3.2.e)",
    "apartado": "Hidrantes"
  },
  {
    "id": "CPEI-T34-OF-6C29E7AB",
    "orden": 220,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿en qué sectores se instalan extintores portátiles?",
    "respuesta": "En todos los sectores de incendio de los establecimientos industriales",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.1",
    "apartado": "Extintores"
  },
  {
    "id": "CPEI-T34-OF-297622A8",
    "orden": 230,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿en qué zonas puede justificarse no instalar extintores?",
    "respuesta": "En las zonas de los almacenamientos operados automáticamente, en los que la actividad impide el acceso de personas",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.1",
    "apartado": "Extintores"
  },
  {
    "id": "CPEI-T34-OF-989A3E6F",
    "orden": 240,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿qué porcentaje de la carga de fuego deben aportar los combustibles de clase A para considerar el sector de clase A?",
    "respuesta": "Al menos, el 90 por ciento de la carga de fuego del sector",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.2",
    "apartado": "Extintores"
  },
  {
    "id": "CPEI-T34-OF-6C548FB3",
    "orden": 250,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿a partir de qué volumen de combustibles líquidos se añaden extintores móviles sobre ruedas?",
    "respuesta": "Supere los 200 litros",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.2, nota 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.2, nota 2",
    "apartado": "Extintores"
  },
  {
    "id": "CPEI-T34-OF-BD5010BC",
    "orden": 260,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿qué eficacia mínima deben tener los extintores móviles sobre ruedas añadidos por combustibles líquidos?",
    "respuesta": "Una eficacia mínima II B",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.2, nota 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.2, nota 2",
    "apartado": "Extintores"
  },
  {
    "id": "CPEI-T34-OF-E3222262",
    "orden": 270,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿cuántos extintores sobre ruedas se añaden si el volumen de combustibles líquidos supera 750 litros?",
    "respuesta": "Dos extintores",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.2, nota 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.2, nota 2",
    "apartado": "Extintores"
  },
  {
    "id": "CPEI-T34-OF-D7385EAA",
    "orden": 280,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿qué recorrido máximo horizontal hasta un extintor se admite en un sector de incendio?",
    "respuesta": "No supere 15 metros",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.4. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.4",
    "apartado": "Extintores"
  },
  {
    "id": "CPEI-T34-OF-0F337FE9",
    "orden": 290,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿hasta cuánto puede ampliarse el recorrido máximo hasta un extintor en áreas de incendio de tipo D?",
    "respuesta": "Podrá ampliarse a 25 metros",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.5. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 4.5",
    "apartado": "Extintores"
  },
  {
    "id": "CPEI-T34-OF-0736AF63",
    "orden": 300,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), en configuración AV, ¿desde qué superficie de sector se exigen BIE?",
    "respuesta": "Sectores de superficie construida de 300 m2 o superior",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 5.1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 5.1",
    "apartado": "BIE y columna seca"
  },
  {
    "id": "CPEI-T34-OF-F994AA4A",
    "orden": 310,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), en configuración AH o B y riesgo alto, ¿desde qué superficie de sector se exigen BIE?",
    "respuesta": "Superficie construida de 200 m2 o superior",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 5.1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 5.1",
    "apartado": "BIE y columna seca"
  },
  {
    "id": "CPEI-T34-OF-2CEB064D",
    "orden": 320,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), en configuración C y riesgo medio, ¿desde qué superficie de sector se exigen BIE?",
    "respuesta": "Superficie construida de 1.000 m2 o superior",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 5.1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 5.1",
    "apartado": "BIE y columna seca"
  },
  {
    "id": "CPEI-T34-OF-7D596165",
    "orden": 330,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), en configuración D, ¿qué áreas requieren BIE?",
    "respuesta": "Áreas de nivel de riesgo intrínseco alto y superficie ocupada de 5.000 m2 o superior",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 5.1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 5.1",
    "apartado": "BIE y columna seca"
  },
  {
    "id": "CPEI-T34-OF-3CED8AB3",
    "orden": 340,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), en reformas, ¿qué BIE previamente instaladas se admiten sin sustituirlas por las de 25 mm?",
    "respuesta": "BIE de 45 mm",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 5.2, nota 1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 5.2, nota 1",
    "apartado": "BIE y columna seca"
  },
  {
    "id": "CPEI-T34-OF-47FF9359",
    "orden": 350,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿a partir de qué altura de evacuación se exige columna seca en establecimientos industriales?",
    "respuesta": "Si su altura de evacuación es de 15 metros o superior",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 6.1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 6.1",
    "apartado": "BIE y columna seca"
  },
  {
    "id": "CPEI-T34-OF-C31A6955",
    "orden": 360,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿en qué plantas tendrán bocas de salida las columnas secas?",
    "respuesta": "En todas las plantas",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 6.2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 6.2",
    "apartado": "BIE y columna seca"
  },
  {
    "id": "CPEI-T34-OF-E4594747",
    "orden": 370,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿qué sección del CTE debe cumplir el alumbrado de emergencia?",
    "respuesta": "CTE DB-SUA 4",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 9. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 9",
    "apartado": "Otras instalaciones"
  },
  {
    "id": "CPEI-T34-OF-80E4452F",
    "orden": 380,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿para qué deben señalizarse los medios manuales de protección contra incendios?",
    "respuesta": "Para facilitar su localización",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 10.1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 10.1",
    "apartado": "Otras instalaciones"
  },
  {
    "id": "CPEI-T34-OF-3C5F1BFA",
    "orden": 390,
    "concepto": "Según el anexo III del RSCIEI (RD 164/2025), ¿qué parte del RIPCI debe cumplir la señalización de los medios de protección?",
    "respuesta": "La sección 2.ª del anexo I del RIPCI",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 10.2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai-3",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO III, apdo. 10.2",
    "apartado": "Otras instalaciones"
  }
];
