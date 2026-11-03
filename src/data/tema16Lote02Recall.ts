/** Tema 16 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (Reglamento de Radiocomunicaciones). Calidad: data/tema16/tema16_lote02_calidad.md. */

export type Tema16RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA16_LOTE02_RECALL_META = {
  "tema": 16,
  "lote": "lote02",
  "title": "Tema 16 · Comunicaciones, lote 2: fundamentos, servicios, estaciones y modalidades (RR UIT 2024)",
  "count": 21,
  "source": "Fase 3 · Reglamento de Radiocomunicaciones de la UIT, edición de 2024, vol. 1 (arts. 1 y 2), versión oficial en español"
} as const;

export const TEMA16_LOTE02_RECALL_CARDS: Tema16RecallCard[] = [
  {
    "id": "CPEI-T16-OF-7BE04C6C",
    "orden": 10,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿qué es la telecomunicación?",
    "respuesta": "Toda transmisión, emisión o recepción de signos, señales, escritos, imágenes, sonidos o informaciones de cualquier naturaleza por hilo, radioelectricidad, medios ópticos u otros sistemas electromagnéticos",
    "fuente": "RR UIT 2024, núm. 1.3, pág. 18. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=18",
    "localizacion": "RR UIT 2024, núm. 1.3, pág. 18",
    "apartado": "Fundamentos"
  },
  {
    "id": "CPEI-T16-OF-BAB78D56",
    "orden": 20,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿qué significa el término general «radio»?",
    "respuesta": "Término general que se aplica al empleo de las ondas radioeléctricas",
    "fuente": "RR UIT 2024, núm. 1.4, pág. 18. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=18",
    "localizacion": "RR UIT 2024, núm. 1.4, pág. 18",
    "apartado": "Fundamentos"
  },
  {
    "id": "CPEI-T16-OF-184601F3",
    "orden": 30,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿por debajo de qué frecuencia se fijan convencionalmente las ondas radioeléctricas?",
    "respuesta": "Por debajo de 3 000 GHz",
    "fuente": "RR UIT 2024, núm. 1.5, pág. 18. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=18",
    "localizacion": "RR UIT 2024, núm. 1.5, pág. 18",
    "apartado": "Fundamentos"
  },
  {
    "id": "CPEI-T16-OF-C3813B15",
    "orden": 40,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿cómo se propagan las ondas radioeléctricas u ondas hertzianas?",
    "respuesta": "Se propagan por el espacio sin guía artificial",
    "fuente": "RR UIT 2024, núm. 1.5, pág. 18. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=18",
    "localizacion": "RR UIT 2024, núm. 1.5, pág. 18",
    "apartado": "Fundamentos"
  },
  {
    "id": "CPEI-T16-OF-E416C315",
    "orden": 50,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿qué es la radiogoniometría?",
    "respuesta": "Radiodeterminación que utiliza la recepción de ondas radioeléctricas para determinar la dirección de una estación o de un objeto",
    "fuente": "RR UIT 2024, núm. 1.12, pág. 19. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=19",
    "localizacion": "RR UIT 2024, núm. 1.12, pág. 19",
    "apartado": "Fundamentos"
  },
  {
    "id": "CPEI-T16-OF-48B8C97A",
    "orden": 60,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿qué es el servicio fijo?",
    "respuesta": "Servicio de radiocomunicación entre puntos fijos determinados",
    "fuente": "RR UIT 2024, núm. 1.20, pág. 19. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=19",
    "localizacion": "RR UIT 2024, núm. 1.20, pág. 19",
    "apartado": "Servicios de radiocomunicación"
  },
  {
    "id": "CPEI-T16-OF-DFF2402C",
    "orden": 70,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿qué es el servicio móvil?",
    "respuesta": "Servicio de radiocomunicación entre estaciones móviles y estaciones terrestres o entre estaciones móviles",
    "fuente": "RR UIT 2024, núm. 1.24, pág. 20. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=20",
    "localizacion": "RR UIT 2024, núm. 1.24, pág. 20",
    "apartado": "Servicios de radiocomunicación"
  },
  {
    "id": "CPEI-T16-OF-CBEBAB08",
    "orden": 80,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿qué es el servicio móvil terrestre?",
    "respuesta": "Servicio móvil entre estaciones de base y estaciones móviles terrestres o entre estaciones móviles terrestres",
    "fuente": "RR UIT 2024, núm. 1.26, pág. 20. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=20",
    "localizacion": "RR UIT 2024, núm. 1.26, pág. 20",
    "apartado": "Servicios de radiocomunicación"
  },
  {
    "id": "CPEI-T16-OF-41ECE14A",
    "orden": 90,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿qué es una estación?",
    "respuesta": "Uno o más transmisores o receptores, o una combinación de transmisores y receptores, incluyendo las instalaciones accesorias, necesarios para asegurar un servicio de radiocomunicación",
    "fuente": "RR UIT 2024, núm. 1.61, pág. 23. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=23",
    "localizacion": "RR UIT 2024, núm. 1.61, pág. 23",
    "apartado": "Estaciones"
  },
  {
    "id": "CPEI-T16-OF-DDD8BF38",
    "orden": 100,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿qué es una estación móvil?",
    "respuesta": "Estación del servicio móvil destinada a ser utilizada en movimiento o mientras esté detenida en puntos no determinados",
    "fuente": "RR UIT 2024, núm. 1.67, pág. 24. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=24",
    "localizacion": "RR UIT 2024, núm. 1.67, pág. 24",
    "apartado": "Estaciones"
  },
  {
    "id": "CPEI-T16-OF-BC7BA883",
    "orden": 110,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿qué es una estación de base?",
    "respuesta": "Estación terrestre del servicio móvil terrestre",
    "fuente": "RR UIT 2024, núm. 1.71, pág. 24. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=24",
    "localizacion": "RR UIT 2024, núm. 1.71, pág. 24",
    "apartado": "Estaciones"
  },
  {
    "id": "CPEI-T16-OF-B89B424C",
    "orden": 120,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿qué es la explotación símplex?",
    "respuesta": "Modo de explotación que permite transmitir alternativamente, en uno u otro sentido de un canal de telecomunicación, por ejemplo, mediante control manual",
    "fuente": "RR UIT 2024, núm. 1.125, pág. 28. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=28",
    "localizacion": "RR UIT 2024, núm. 1.125, pág. 28",
    "apartado": "Modalidades de explotación"
  },
  {
    "id": "CPEI-T16-OF-E435F115",
    "orden": 130,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿en qué consiste la explotación dúplex?",
    "respuesta": "Simultáneamente en los dos sentidos de un canal de telecomunicación",
    "fuente": "RR UIT 2024, núm. 1.126, pág. 28. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=28",
    "localizacion": "RR UIT 2024, núm. 1.126, pág. 28",
    "apartado": "Modalidades de explotación"
  },
  {
    "id": "CPEI-T16-OF-7617EBEF",
    "orden": 140,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿qué es la explotación semidúplex?",
    "respuesta": "Modo de explotación símplex en un extremo del circuito de telecomunicación y de explotación dúplex en el otro",
    "fuente": "RR UIT 2024, núm. 1.127, pág. 28. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=28",
    "localizacion": "RR UIT 2024, núm. 1.127, pág. 28",
    "apartado": "Modalidades de explotación"
  },
  {
    "id": "CPEI-T16-OF-9C110C92",
    "orden": 150,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿cuántas frecuencias requieren por lo general la explotación dúplex y la semidúplex?",
    "respuesta": "Requieren el empleo de dos frecuencias",
    "fuente": "RR UIT 2024, núm. 1.125-1.127, nota 2, pág. 28. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=28",
    "localizacion": "RR UIT 2024, núm. 1.125-1.127, nota 2, pág. 28",
    "apartado": "Modalidades de explotación"
  },
  {
    "id": "CPEI-T16-OF-9F233450",
    "orden": 160,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿con cuántas frecuencias puede hacerse la explotación símplex?",
    "respuesta": "Con una o dos frecuencias",
    "fuente": "RR UIT 2024, núm. 1.125-1.127, nota 2, pág. 28. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=28",
    "localizacion": "RR UIT 2024, núm. 1.125-1.127, nota 2, pág. 28",
    "apartado": "Modalidades de explotación"
  },
  {
    "id": "CPEI-T16-OF-6981A8E5",
    "orden": 170,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿qué gama de frecuencias corresponde a la banda VHF?",
    "respuesta": "30 a 300 MHz",
    "fuente": "RR UIT 2024, núm. 2.1, pág. 36. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=36",
    "localizacion": "RR UIT 2024, núm. 2.1, pág. 36",
    "apartado": "Bandas de frecuencias"
  },
  {
    "id": "CPEI-T16-OF-4B99C946",
    "orden": 180,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿qué gama de frecuencias corresponde a la banda UHF?",
    "respuesta": "300 a 3 000 MHz",
    "fuente": "RR UIT 2024, núm. 2.1, pág. 36. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=36",
    "localizacion": "RR UIT 2024, núm. 2.1, pág. 36",
    "apartado": "Bandas de frecuencias"
  },
  {
    "id": "CPEI-T16-OF-5955A3BD",
    "orden": 190,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿qué gama de frecuencias corresponde a la banda HF?",
    "respuesta": "3 a 30 MHz",
    "fuente": "RR UIT 2024, núm. 2.1, pág. 36. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=36",
    "localizacion": "RR UIT 2024, núm. 2.1, pág. 36",
    "apartado": "Bandas de frecuencias"
  },
  {
    "id": "CPEI-T16-OF-ECE94290",
    "orden": 200,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿cómo se denominan, en la subdivisión métrica, las ondas de la banda VHF?",
    "respuesta": "Ondas métricas",
    "fuente": "RR UIT 2024, núm. 2.1, pág. 36. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=36",
    "localizacion": "RR UIT 2024, núm. 2.1, pág. 36",
    "apartado": "Bandas de frecuencias"
  },
  {
    "id": "CPEI-T16-OF-30A9D281",
    "orden": 210,
    "concepto": "Según el Reglamento de Radiocomunicaciones de la UIT, ¿cómo se denominan, en la subdivisión métrica, las ondas de la banda UHF?",
    "respuesta": "Ondas decimétricas",
    "fuente": "RR UIT 2024, núm. 2.1, pág. 36. Reglamento de Radiocomunicaciones de la UIT, edición de 2024, Volumen 1: Artículos (artículos 1 y 2); texto íntegro oficial (edición de 2024, Volumen 1 (PDF oficial de la UIT de 30/08/2024)): https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf#page=36",
    "localizacion": "RR UIT 2024, núm. 2.1, pág. 36",
    "apartado": "Bandas de frecuencias"
  }
];
