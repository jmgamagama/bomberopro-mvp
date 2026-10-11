/** Tema 22 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (INSST-NTP809, INSST-NTP843, INSST-NTP1170, INSST-NTP1218). Calidad: data/tema22/tema22_lote02_calidad.md. */

export type Tema22RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA22_LOTE02_RECALL_META = {
  "tema": 22,
  "lote": "lote02",
  "title": "Tema 22 · lote 2: anclajes, líneas de vida, factor de caída y sistemas anticaídas (NTP 809, 843, 1170 y 1218 del INSST)",
  "count": 27,
  "source": "Fase 5 · INSST, NTP 809 (2008), NTP 843 (2009), NTP 1170 (2022) y NTP 1218 (2025), insst.es"
} as const;

export const TEMA22_LOTE02_RECALL_CARDS: Tema22RecallCard[] = [
  {
    "id": "CPEI-T22-OF-BE9EEB24",
    "orden": 10,
    "concepto": "Según la NTP 1170 del INSST, ¿a partir de qué altura de caída se requiere protección contra caídas de altura?",
    "respuesta": "Superior a 2 metros",
    "fuente": "NTP 1170 (INSST), AÑO 2022, pág. 1. INSST-NTP1170, texto consolidado (últ. actualización 2022): https://www.insst.es/documents/94886/7789690/NTP+1170+Utilizaci%C3%B3n+de+EPI+en+trabajos+con+riesgo+de+ca%C3%ADda+de+altura.pdf#p01",
    "localizacion": "NTP 1170 (INSST), AÑO 2022, pág. 1",
    "apartado": "Física de la caída y factor de caída"
  },
  {
    "id": "CPEI-T22-OF-FA028C3A",
    "orden": 20,
    "concepto": "Según la NTP 1170, ¿qué es la distancia de parada?",
    "respuesta": "La distancia vertical recorrida por el cuerpo desde el inicio de la caída libre hasta la posición final de reposo",
    "fuente": "NTP 1170 (INSST), 2, pág. 2. INSST-NTP1170, texto consolidado (últ. actualización 2022): https://www.insst.es/documents/94886/7789690/NTP+1170+Utilizaci%C3%B3n+de+EPI+en+trabajos+con+riesgo+de+ca%C3%ADda+de+altura.pdf#p02",
    "localizacion": "NTP 1170 (INSST), 2, pág. 2",
    "apartado": "Física de la caída y factor de caída"
  },
  {
    "id": "CPEI-T22-OF-3414029A",
    "orden": 30,
    "concepto": "Según la NTP 1170, ¿qué impacto máximo no deben superar los EPI contra caídas sobre la persona?",
    "respuesta": "Los 6 kN",
    "fuente": "NTP 1170 (INSST), 2, pág. 2. INSST-NTP1170, texto consolidado (últ. actualización 2022): https://www.insst.es/documents/94886/7789690/NTP+1170+Utilizaci%C3%B3n+de+EPI+en+trabajos+con+riesgo+de+ca%C3%ADda+de+altura.pdf#p02",
    "localizacion": "NTP 1170 (INSST), 2, pág. 2",
    "apartado": "Física de la caída y factor de caída"
  },
  {
    "id": "CPEI-T22-OF-67A74BA0",
    "orden": 40,
    "concepto": "Según la NTP 1170, ¿a qué hace referencia el factor de caída?",
    "respuesta": "A la relación entre la distancia de caída y la longitud de la cuerda utilizada",
    "fuente": "NTP 1170 (INSST), 2, pág. 2. INSST-NTP1170, texto consolidado (últ. actualización 2022): https://www.insst.es/documents/94886/7789690/NTP+1170+Utilizaci%C3%B3n+de+EPI+en+trabajos+con+riesgo+de+ca%C3%ADda+de+altura.pdf#p02",
    "localizacion": "NTP 1170 (INSST), 2, pág. 2",
    "apartado": "Física de la caída y factor de caída"
  },
  {
    "id": "CPEI-T22-OF-FFB1A6A1",
    "orden": 50,
    "concepto": "Según la NTP 1170, en factor de caída 0, ¿dónde está situado el punto de anclaje?",
    "respuesta": "Por encima de la conexión al arnés",
    "fuente": "NTP 1170 (INSST), 2, pág. 2. INSST-NTP1170, texto consolidado (últ. actualización 2022): https://www.insst.es/documents/94886/7789690/NTP+1170+Utilizaci%C3%B3n+de+EPI+en+trabajos+con+riesgo+de+ca%C3%ADda+de+altura.pdf#p02",
    "localizacion": "NTP 1170 (INSST), 2, pág. 2",
    "apartado": "Física de la caída y factor de caída"
  },
  {
    "id": "CPEI-T22-OF-6903D316",
    "orden": 60,
    "concepto": "Según la NTP 1170, en factor de caída 1, ¿dónde está situado el punto de anclaje?",
    "respuesta": "A la misma altura de la conexión al arnés",
    "fuente": "NTP 1170 (INSST), 2, pág. 2. INSST-NTP1170, texto consolidado (últ. actualización 2022): https://www.insst.es/documents/94886/7789690/NTP+1170+Utilizaci%C3%B3n+de+EPI+en+trabajos+con+riesgo+de+ca%C3%ADda+de+altura.pdf#p02",
    "localizacion": "NTP 1170 (INSST), 2, pág. 2",
    "apartado": "Física de la caída y factor de caída"
  },
  {
    "id": "CPEI-T22-OF-60FCDB21",
    "orden": 70,
    "concepto": "Según la NTP 1170, con factor de caída 2, ¿cuál es la distancia de caída?",
    "respuesta": "El doble de la longitud de la conexión utilizada",
    "fuente": "NTP 1170 (INSST), 2, pág. 2. INSST-NTP1170, texto consolidado (últ. actualización 2022): https://www.insst.es/documents/94886/7789690/NTP+1170+Utilizaci%C3%B3n+de+EPI+en+trabajos+con+riesgo+de+ca%C3%ADda+de+altura.pdf#p02",
    "localizacion": "NTP 1170 (INSST), 2, pág. 2",
    "apartado": "Física de la caída y factor de caída"
  },
  {
    "id": "CPEI-T22-OF-08BEB5A8",
    "orden": 80,
    "concepto": "Según la NTP 1170, ¿qué es el espacio libre de caída?",
    "respuesta": "La altura mínima que debe existir para evitar que la persona pueda colisionar con el suelo o con otros elementos en caso de que sufriera una caída",
    "fuente": "NTP 1170 (INSST), 2, pág. 2. INSST-NTP1170, texto consolidado (últ. actualización 2022): https://www.insst.es/documents/94886/7789690/NTP+1170+Utilizaci%C3%B3n+de+EPI+en+trabajos+con+riesgo+de+ca%C3%ADda+de+altura.pdf#p02",
    "localizacion": "NTP 1170 (INSST), 2, pág. 2",
    "apartado": "Física de la caída y factor de caída"
  },
  {
    "id": "CPEI-T22-OF-DBCDA942",
    "orden": 90,
    "concepto": "Según la NTP 1170, ¿con qué otro nombre se conoce el síndrome de compresión?",
    "respuesta": "Síndrome ortostático",
    "fuente": "NTP 1170 (INSST), 3 Notas Técnicas de Prevención, pág. 3. INSST-NTP1170, texto consolidado (últ. actualización 2022): https://www.insst.es/documents/94886/7789690/NTP+1170+Utilizaci%C3%B3n+de+EPI+en+trabajos+con+riesgo+de+ca%C3%ADda+de+altura.pdf#p03",
    "localizacion": "NTP 1170 (INSST), 3 Notas Técnicas de Prevención, pág. 3",
    "apartado": "Física de la caída y factor de caída"
  },
  {
    "id": "CPEI-T22-OF-346A4658",
    "orden": 100,
    "concepto": "Según la NTP 1170, ¿qué trayectoria describe la caída cuando se trabaja alejado de la vertical del punto de anclaje?",
    "respuesta": "Una trayectoria semicircular describiendo un péndulo",
    "fuente": "NTP 1170 (INSST), 3 Notas Técnicas de Prevención, pág. 3. INSST-NTP1170, texto consolidado (últ. actualización 2022): https://www.insst.es/documents/94886/7789690/NTP+1170+Utilizaci%C3%B3n+de+EPI+en+trabajos+con+riesgo+de+ca%C3%ADda+de+altura.pdf#p03",
    "localizacion": "NTP 1170 (INSST), 3 Notas Técnicas de Prevención, pág. 3",
    "apartado": "Física de la caída y factor de caída"
  },
  {
    "id": "CPEI-T22-OF-6B0759C1",
    "orden": 110,
    "concepto": "Según la NTP 1170, en trabajos en suspensión, ¿qué dos líneas se utilizan?",
    "respuesta": "Una línea de trabajo y otra línea de seguridad",
    "fuente": "NTP 1170 (INSST), 4, pág. 4. INSST-NTP1170, texto consolidado (últ. actualización 2022): https://www.insst.es/documents/94886/7789690/NTP+1170+Utilizaci%C3%B3n+de+EPI+en+trabajos+con+riesgo+de+ca%C3%ADda+de+altura.pdf#p04",
    "localizacion": "NTP 1170 (INSST), 4, pág. 4",
    "apartado": "Física de la caída y factor de caída"
  },
  {
    "id": "CPEI-T22-OF-1597FE48",
    "orden": 120,
    "concepto": "Según la NTP 809, ¿cuántas clases de dispositivos de anclaje describe la UNE-EN 795?",
    "respuesta": "Seis clases",
    "fuente": "NTP 809 (INSST), Año: 2008, pág. 1. INSST-NTP809, texto consolidado (últ. actualización 2008): https://www.insst.es/documents/94886/7843381/809+web.pdf#p01",
    "localizacion": "NTP 809 (INSST), Año: 2008, pág. 1",
    "apartado": "Dispositivos de anclaje"
  },
  {
    "id": "CPEI-T22-OF-C1A25F30",
    "orden": 130,
    "concepto": "Según la NTP 809, ¿qué es un punto de anclaje?",
    "respuesta": "Un elemento al que puede estar sujeto un equipo de protección individual contra caídas",
    "fuente": "NTP 809 (INSST), Año: 2008, pág. 1. INSST-NTP809, texto consolidado (últ. actualización 2008): https://www.insst.es/documents/94886/7843381/809+web.pdf#p01",
    "localizacion": "NTP 809 (INSST), Año: 2008, pág. 1",
    "apartado": "Dispositivos de anclaje"
  },
  {
    "id": "CPEI-T22-OF-9F8C446E",
    "orden": 140,
    "concepto": "Según la NTP 809, ¿qué clases de dispositivos de anclaje se consideran EPI y llevan marcado CE?",
    "respuesta": "Las clases B y E",
    "fuente": "NTP 809 (INSST), 2 Notas Técnicas de Prevención, pág. 2. INSST-NTP809, texto consolidado (últ. actualización 2008): https://www.insst.es/documents/94886/7843381/809+web.pdf#p02",
    "localizacion": "NTP 809 (INSST), 2 Notas Técnicas de Prevención, pág. 2",
    "apartado": "Dispositivos de anclaje"
  },
  {
    "id": "CPEI-T22-OF-184E4455",
    "orden": 150,
    "concepto": "Según la NTP 809, ¿qué resistencia mínima debe tener un dispositivo de anclaje de clase A1 en la dirección de la caída?",
    "respuesta": "Superior a 10 kN",
    "fuente": "NTP 809 (INSST), 2 Notas Técnicas de Prevención, pág. 2. INSST-NTP809, texto consolidado (últ. actualización 2008): https://www.insst.es/documents/94886/7843381/809+web.pdf#p02",
    "localizacion": "NTP 809 (INSST), 2 Notas Técnicas de Prevención, pág. 2",
    "apartado": "Dispositivos de anclaje"
  },
  {
    "id": "CPEI-T22-OF-355B9E82",
    "orden": 160,
    "concepto": "Según la NTP 809, ¿para qué fijación están diseñados los dispositivos de anclaje de clase A2?",
    "respuesta": "Una fijación sobre tejados inclinados",
    "fuente": "NTP 809 (INSST), 2 Notas Técnicas de Prevención, pág. 2. INSST-NTP809, texto consolidado (últ. actualización 2008): https://www.insst.es/documents/94886/7843381/809+web.pdf#p02",
    "localizacion": "NTP 809 (INSST), 2 Notas Técnicas de Prevención, pág. 2",
    "apartado": "Dispositivos de anclaje"
  },
  {
    "id": "CPEI-T22-OF-26A2327C",
    "orden": 170,
    "concepto": "Según la NTP 809, ¿cómo son los dispositivos de anclaje de clase B?",
    "respuesta": "Provisionales y transportables",
    "fuente": "NTP 809 (INSST), 3 Notas Técnicas de Prevención, pág. 3. INSST-NTP809, texto consolidado (últ. actualización 2008): https://www.insst.es/documents/94886/7843381/809+web.pdf#p03",
    "localizacion": "NTP 809 (INSST), 3 Notas Técnicas de Prevención, pág. 3",
    "apartado": "Dispositivos de anclaje"
  },
  {
    "id": "CPEI-T22-OF-D018E939",
    "orden": 180,
    "concepto": "Según la NTP 843, ¿qué desviación máxima respecto a la horizontal admite la línea de anclaje flexible de clase C?",
    "respuesta": "No se desvía de la horizontal más de 15°",
    "fuente": "NTP 843 (INSST), Año: 2009, pág. 1. INSST-NTP843, texto consolidado (últ. actualización 2009): https://www.insst.es/documents/94886/7842059/843+web.pdf#p01",
    "localizacion": "NTP 843 (INSST), Año: 2009, pág. 1",
    "apartado": "Líneas de vida (clase C)"
  },
  {
    "id": "CPEI-T22-OF-52312071",
    "orden": 190,
    "concepto": "Según la NTP 843, ¿son EPI los dispositivos de anclaje de clase C?",
    "respuesta": "No se consideran EPI y no deben llevar marcado CE",
    "fuente": "NTP 843 (INSST), Año: 2009, pág. 1. INSST-NTP843, texto consolidado (últ. actualización 2009): https://www.insst.es/documents/94886/7842059/843+web.pdf#p01",
    "localizacion": "NTP 843 (INSST), Año: 2009, pág. 1",
    "apartado": "Líneas de vida (clase C)"
  },
  {
    "id": "CPEI-T22-OF-988E2F1C",
    "orden": 200,
    "concepto": "Según la NTP 843, ¿qué es el anclaje de extremidad?",
    "respuesta": "Elemento que conecta el extremo de la línea de anclaje a la estructura",
    "fuente": "NTP 843 (INSST), Año: 2009, pág. 1. INSST-NTP843, texto consolidado (últ. actualización 2009): https://www.insst.es/documents/94886/7842059/843+web.pdf#p01",
    "localizacion": "NTP 843 (INSST), Año: 2009, pág. 1",
    "apartado": "Líneas de vida (clase C)"
  },
  {
    "id": "CPEI-T22-OF-DC5F1339",
    "orden": 210,
    "concepto": "Según la NTP 843, ¿qué permiten reducir los anclajes intermedios en caso de caída?",
    "respuesta": "Reducir la flecha y la tensión de la línea",
    "fuente": "NTP 843 (INSST), Año: 2009, pág. 1. INSST-NTP843, texto consolidado (últ. actualización 2009): https://www.insst.es/documents/94886/7842059/843+web.pdf#p01",
    "localizacion": "NTP 843 (INSST), Año: 2009, pág. 1",
    "apartado": "Líneas de vida (clase C)"
  },
  {
    "id": "CPEI-T22-OF-2AA9DC94",
    "orden": 220,
    "concepto": "Según la NTP 1218 del INSST, ¿de qué tres componentes se compone un sistema anticaídas?",
    "respuesta": "Un dispositivo de prensión del cuerpo, un sistema de conexión y un punto de anclaje",
    "fuente": "NTP 1218 (INSST), 2 Notas Técnicas de Prevención, pág. 2. INSST-NTP1218, texto consolidado (últ. actualización 2025): https://www.insst.es/documents/d/portal-insst/ntp-1218-sistemas-de-proteccion-individual-contra-caidas-sistemas-anticaidas-ano-2025#p02",
    "localizacion": "NTP 1218 (INSST), 2 Notas Técnicas de Prevención, pág. 2",
    "apartado": "Sistemas anticaídas"
  },
  {
    "id": "CPEI-T22-OF-A170552C",
    "orden": 230,
    "concepto": "Según la NTP 1218, ¿cuál es el único dispositivo de prensión del cuerpo destinado a detener una caída?",
    "respuesta": "El arnés anticaídas",
    "fuente": "NTP 1218 (INSST), 2 Notas Técnicas de Prevención, pág. 2. INSST-NTP1218, texto consolidado (últ. actualización 2025): https://www.insst.es/documents/d/portal-insst/ntp-1218-sistemas-de-proteccion-individual-contra-caidas-sistemas-anticaidas-ano-2025#p02",
    "localizacion": "NTP 1218 (INSST), 2 Notas Técnicas de Prevención, pág. 2",
    "apartado": "Sistemas anticaídas"
  },
  {
    "id": "CPEI-T22-OF-41B3EEA5",
    "orden": 240,
    "concepto": "Según la NTP 1218, ¿dónde están situados los elementos de enganche anticaídas del arnés?",
    "respuesta": "En la zona dorsal y/o pectoral",
    "fuente": "NTP 1218 (INSST), 2 Notas Técnicas de Prevención, pág. 2. INSST-NTP1218, texto consolidado (últ. actualización 2025): https://www.insst.es/documents/d/portal-insst/ntp-1218-sistemas-de-proteccion-individual-contra-caidas-sistemas-anticaidas-ano-2025#p02",
    "localizacion": "NTP 1218 (INSST), 2 Notas Técnicas de Prevención, pág. 2",
    "apartado": "Sistemas anticaídas"
  },
  {
    "id": "CPEI-T22-OF-F8885754",
    "orden": 250,
    "concepto": "Según la NTP 1218, ¿puede usarse un equipo de amarre sin absorbedor de energía para detener la caída?",
    "respuesta": "No se puede usar un equipo de amarre sin un absorbedor de energía",
    "fuente": "NTP 1218 (INSST), 2 Notas Técnicas de Prevención, pág. 2. INSST-NTP1218, texto consolidado (últ. actualización 2025): https://www.insst.es/documents/d/portal-insst/ntp-1218-sistemas-de-proteccion-individual-contra-caidas-sistemas-anticaidas-ano-2025#p02",
    "localizacion": "NTP 1218 (INSST), 2 Notas Técnicas de Prevención, pág. 2",
    "apartado": "Sistemas anticaídas"
  },
  {
    "id": "CPEI-T22-OF-5A5AA928",
    "orden": 260,
    "concepto": "Según la NTP 1218, ¿qué norma regula los dispositivos anticaídas retráctiles?",
    "respuesta": "UNE-EN 360:2023",
    "fuente": "NTP 1218 (INSST), 2 Notas Técnicas de Prevención, pág. 2. INSST-NTP1218, texto consolidado (últ. actualización 2025): https://www.insst.es/documents/d/portal-insst/ntp-1218-sistemas-de-proteccion-individual-contra-caidas-sistemas-anticaidas-ano-2025#p02",
    "localizacion": "NTP 1218 (INSST), 2 Notas Técnicas de Prevención, pág. 2",
    "apartado": "Sistemas anticaídas"
  },
  {
    "id": "CPEI-T22-OF-8D4B7453",
    "orden": 270,
    "concepto": "Según la NTP 1218, ¿qué norma regula los conectores?",
    "respuesta": "UNE-EN 362:2005",
    "fuente": "NTP 1218 (INSST), 3 Notas Técnicas de Prevención, pág. 3. INSST-NTP1218, texto consolidado (últ. actualización 2025): https://www.insst.es/documents/d/portal-insst/ntp-1218-sistemas-de-proteccion-individual-contra-caidas-sistemas-anticaidas-ano-2025#p03",
    "localizacion": "NTP 1218 (INSST), 3 Notas Técnicas de Prevención, pág. 3",
    "apartado": "Sistemas anticaídas"
  }
];
