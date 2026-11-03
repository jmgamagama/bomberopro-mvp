/** Tema 25 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (BOE-A-2025-77). Calidad: data/tema25/tema25_calidad.md. */

export type Tema25RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA25_RECALL_META = {
  "tema": 25,
  "title": "Tema 25 · Mercancías peligrosas: ADR 2025 (conceptos, cisternas, panel naranja, placas-etiquetas y actuación)",
  "count": 47,
  "source": "Fase 3 · ADR 2025, Anejos A y B (BOE-A-2025-77, BOE nº 3 de 03/01/2025)"
} as const;

export const TEMA25_RECALL_CARDS: Tema25RecallCard[] = [
  {
    "id": "CPEI-T25-OF-40D9AC2F",
    "orden": 10,
    "concepto": "Según el ADR 2025, ¿qué materias integran el grupo de embalaje I?",
    "respuesta": "Materias muy peligrosas",
    "fuente": "ADR 2025, 1.2.1, «Grupo de embalaje», pág. 25. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=25",
    "localizacion": "ADR 2025, 1.2.1, «Grupo de embalaje», pág. 25",
    "apartado": "Conceptos y clasificación"
  },
  {
    "id": "CPEI-T25-OF-E4359238",
    "orden": 20,
    "concepto": "Según el ADR 2025, ¿qué materias integran el grupo de embalaje II?",
    "respuesta": "Materias medianamente peligrosas",
    "fuente": "ADR 2025, 1.2.1, «Grupo de embalaje», pág. 25. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=25",
    "localizacion": "ADR 2025, 1.2.1, «Grupo de embalaje», pág. 25",
    "apartado": "Conceptos y clasificación"
  },
  {
    "id": "CPEI-T25-OF-130E4CEA",
    "orden": 30,
    "concepto": "Según el ADR 2025, ¿qué materias integran el grupo de embalaje III?",
    "respuesta": "Materias poco peligrosas",
    "fuente": "ADR 2025, 1.2.1, «Grupo de embalaje», pág. 25. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=25",
    "localizacion": "ADR 2025, 1.2.1, «Grupo de embalaje», pág. 25",
    "apartado": "Conceptos y clasificación"
  },
  {
    "id": "CPEI-T25-OF-75431C45",
    "orden": 40,
    "concepto": "Según el ADR 2025, ¿qué capacidad mínima define una cisterna fija?",
    "respuesta": "Una capacidad superior a 1000 litros",
    "fuente": "ADR 2025, 1.2.1, «Cisterna fija», pág. 16. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=16",
    "localizacion": "ADR 2025, 1.2.1, «Cisterna fija», pág. 16",
    "apartado": "Cisternas"
  },
  {
    "id": "CPEI-T25-OF-39970D0C",
    "orden": 50,
    "concepto": "Según el ADR 2025, ¿qué capacidad mínima define una cisterna desmontable?",
    "respuesta": "Una capacidad superior a 450 litros",
    "fuente": "ADR 2025, 1.2.1, «Cisterna desmontable», pág. 16. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=16",
    "localizacion": "ADR 2025, 1.2.1, «Cisterna desmontable», pág. 16",
    "apartado": "Cisternas"
  },
  {
    "id": "CPEI-T25-OF-4D8A6215",
    "orden": 60,
    "concepto": "Según el ADR 2025, ¿qué incluye la definición de «cisterna»?",
    "respuesta": "Un depósito, incluidos sus equipos de servicio y de estructura",
    "fuente": "ADR 2025, 1.2.1, «Cisterna», pág. 16. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=16",
    "localizacion": "ADR 2025, 1.2.1, «Cisterna», pág. 16",
    "apartado": "Cisternas"
  },
  {
    "id": "CPEI-T25-OF-A007DD76",
    "orden": 70,
    "concepto": "Según el ADR 2025, si se separa un remolque con mercancías peligrosas de su vehículo portador, ¿dónde debe permanecer el panel naranja?",
    "respuesta": "Unido a la parte trasera del remolque",
    "fuente": "ADR 2025, 5.3.2.1.1, pág. 811. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=811",
    "localizacion": "ADR 2025, 5.3.2.1.1, pág. 811",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-0347A831",
    "orden": 80,
    "concepto": "Según el ADR 2025, ¿qué dimensiones deben tener los paneles naranja?",
    "respuesta": "Una base de 40 cm. y una altura de 30 cm.",
    "fuente": "ADR 2025, 5.3.2.2.1, pág. 812. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=812",
    "localizacion": "ADR 2025, 5.3.2.2.1, pág. 812",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-DA1BFF07",
    "orden": 90,
    "concepto": "Según el ADR 2025, ¿qué ribete deben llevar los paneles naranja?",
    "respuesta": "Un ribete negro de 15mm.",
    "fuente": "ADR 2025, 5.3.2.2.1, pág. 812. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=812",
    "localizacion": "ADR 2025, 5.3.2.2.1, pág. 812",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-5EF4E218",
    "orden": 100,
    "concepto": "Según el ADR 2025, ¿tras un incendio de qué duración no debe separarse el panel naranja de su fijación?",
    "respuesta": "15 minutos",
    "fuente": "ADR 2025, 5.3.2.2.1, pág. 812. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=812",
    "localizacion": "ADR 2025, 5.3.2.2.1, pág. 812",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-739B0312",
    "orden": 110,
    "concepto": "Según el ADR 2025, ¿hasta qué dimensiones mínimas pueden reducirse los paneles naranja si la superficie del vehículo es insuficiente?",
    "respuesta": "300mm para la base, 120mm para la altura y 10mm para el reborde negro",
    "fuente": "ADR 2025, 5.3.2.2.1, pág. 812. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=812",
    "localizacion": "ADR 2025, 5.3.2.2.1, pág. 812",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-2C424B41",
    "orden": 120,
    "concepto": "Según el ADR 2025, ¿qué altura y espesor deben tener las cifras del número de peligro y del número ONU en el panel naranja?",
    "respuesta": "Cifras negras de 10 cm. de altura y de 15mm de espesor",
    "fuente": "ADR 2025, 5.3.2.2.2, pág. 813. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=813",
    "localizacion": "ADR 2025, 5.3.2.2.2, pág. 813",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-98E0057D",
    "orden": 130,
    "concepto": "Según el ADR 2025, ¿en qué parte del panel naranja se inscribe el número de identificación del peligro?",
    "respuesta": "En la parte superior del panel",
    "fuente": "ADR 2025, 5.3.2.2.2, pág. 813. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=813",
    "localizacion": "ADR 2025, 5.3.2.2.2, pág. 813",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-5AB685C0",
    "orden": 140,
    "concepto": "Según el ADR 2025, ¿cuántas cifras tiene el número ONU del panel naranja?",
    "respuesta": "Número ONU (4 cifras)",
    "fuente": "ADR 2025, 5.3.2.2.3, pág. 813. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=813",
    "localizacion": "ADR 2025, 5.3.2.2.3, pág. 813",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-32DA303D",
    "orden": 150,
    "concepto": "Según el ADR 2025, ¿qué tolerancia admiten las dimensiones de la sección del panel naranja?",
    "respuesta": "Una tolerancia de ± 10%",
    "fuente": "ADR 2025, 5.3.2.2.4, pág. 813. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=813",
    "localizacion": "ADR 2025, 5.3.2.2.4, pág. 813",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-3042DBC4",
    "orden": 160,
    "concepto": "Según el ADR 2025, ¿cuántas cifras comprende el número de identificación del peligro?",
    "respuesta": "Dos o tres cifras",
    "fuente": "ADR 2025, 5.3.2.3.1, pág. 813. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=813",
    "localizacion": "ADR 2025, 5.3.2.3.1, pág. 813",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-D40A8F7A",
    "orden": 170,
    "concepto": "Según el ADR 2025, en el número de identificación del peligro, ¿qué indica la cifra 2?",
    "respuesta": "Emanación de gases resultantes de presión o de una reacción química",
    "fuente": "ADR 2025, 5.3.2.3.1, pág. 814. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=814",
    "localizacion": "ADR 2025, 5.3.2.3.1, pág. 814",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-36E1AB62",
    "orden": 180,
    "concepto": "Según el ADR 2025, en el número de identificación del peligro, ¿qué indica la cifra 5?",
    "respuesta": "Comburente (favorece el incendio)",
    "fuente": "ADR 2025, 5.3.2.3.1, pág. 814. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=814",
    "localizacion": "ADR 2025, 5.3.2.3.1, pág. 814",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-769DADDC",
    "orden": 190,
    "concepto": "Según el ADR 2025, en el número de identificación del peligro, ¿qué indica la cifra 6?",
    "respuesta": "Toxicidad o peligro de infección",
    "fuente": "ADR 2025, 5.3.2.3.1, pág. 814. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=814",
    "localizacion": "ADR 2025, 5.3.2.3.1, pág. 814",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-44BA051B",
    "orden": 200,
    "concepto": "Según el ADR 2025, en el número de identificación del peligro, ¿qué indica la cifra 8?",
    "respuesta": "Corrosividad",
    "fuente": "ADR 2025, 5.3.2.3.1, pág. 814. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=814",
    "localizacion": "ADR 2025, 5.3.2.3.1, pág. 814",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-3AFE15E5",
    "orden": 210,
    "concepto": "Según el ADR 2025, en el número de identificación del peligro, ¿qué indica la cifra 9?",
    "respuesta": "Peligro de reacción violenta espontánea",
    "fuente": "ADR 2025, 5.3.2.3.1, pág. 814. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=814",
    "localizacion": "ADR 2025, 5.3.2.3.1, pág. 814",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-9631AB52",
    "orden": 220,
    "concepto": "Según el ADR 2025, ¿qué indica la duplicación de una cifra en el número de identificación del peligro?",
    "respuesta": "Una intensificación del peligro relacionado con ella",
    "fuente": "ADR 2025, 5.3.2.3.1, pág. 814. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=814",
    "localizacion": "ADR 2025, 5.3.2.3.1, pág. 814",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-B3BC8275",
    "orden": 230,
    "concepto": "Según el ADR 2025, ¿cómo se completa el número de peligro cuando el peligro está indicado suficientemente con una sola cifra?",
    "respuesta": "Ésta se completa con un cero",
    "fuente": "ADR 2025, 5.3.2.3.1, pág. 814. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=814",
    "localizacion": "ADR 2025, 5.3.2.3.1, pág. 814",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-164BED67",
    "orden": 240,
    "concepto": "Según el ADR 2025, ¿qué indica la letra «X» antepuesta al número de identificación del peligro?",
    "respuesta": "Que la materia reacciona peligrosamente con el agua",
    "fuente": "ADR 2025, 5.3.2.3.1, pág. 814. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=814",
    "localizacion": "ADR 2025, 5.3.2.3.1, pág. 814",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-57EA67B5",
    "orden": 250,
    "concepto": "Según el ADR 2025, ¿cuándo puede utilizarse agua sobre materias con número de peligro precedido de «X»?",
    "respuesta": "Sólo puede utilizarse con la aprobación de expertos",
    "fuente": "ADR 2025, 5.3.2.3.1, pág. 814. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=814",
    "localizacion": "ADR 2025, 5.3.2.3.1, pág. 814",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-C7F36352",
    "orden": 260,
    "concepto": "Según el ADR 2025, ¿qué significa el número de identificación de peligro 33?",
    "respuesta": "Materia líquida muy inflamable (punto de inflamación inferior a 23° C)",
    "fuente": "ADR 2025, 5.3.2.3.2, pág. 814. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=814",
    "localizacion": "ADR 2025, 5.3.2.3.2, pág. 814",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-26CD0F45",
    "orden": 270,
    "concepto": "Según el ADR 2025, ¿qué significa el número de identificación de peligro 23?",
    "respuesta": "Gas inflamable",
    "fuente": "ADR 2025, 5.3.2.3.2, pág. 814. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=814",
    "localizacion": "ADR 2025, 5.3.2.3.2, pág. 814",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-27FD5692",
    "orden": 280,
    "concepto": "Según el ADR 2025, ¿qué significa el número de identificación de peligro 20?",
    "respuesta": "Gas asfixiante o que no presenta peligro subsidiario",
    "fuente": "ADR 2025, 5.3.2.3.2, pág. 814. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=814",
    "localizacion": "ADR 2025, 5.3.2.3.2, pág. 814",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-AD16DBA5",
    "orden": 290,
    "concepto": "Según el ADR 2025, ¿qué significa el número de identificación de peligro 26?",
    "respuesta": "Gas tóxico",
    "fuente": "ADR 2025, 5.3.2.3.2, pág. 814. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=814",
    "localizacion": "ADR 2025, 5.3.2.3.2, pág. 814",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-AEFDA76B",
    "orden": 300,
    "concepto": "Según el ADR 2025, para las materias de la clase 1, ¿qué se utiliza como número de identificación de peligro?",
    "respuesta": "El código de clasificación según la columna (3b) de la Tabla A del capítulo 3.2",
    "fuente": "ADR 2025, 5.3.2.3.2, pág. 814. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=814",
    "localizacion": "ADR 2025, 5.3.2.3.2, pág. 814",
    "apartado": "Panel naranja y número de peligro"
  },
  {
    "id": "CPEI-T25-OF-33307AB4",
    "orden": 310,
    "concepto": "Según el ADR 2025, ¿qué forma debe tener la placa-etiqueta?",
    "respuesta": "La forma de un cuadrado colocado sobre un vértice formando un ángulo de 45º (en rombo)",
    "fuente": "ADR 2025, 5.3.1.7.1, pág. 810. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=810",
    "localizacion": "ADR 2025, 5.3.1.7.1, pág. 810",
    "apartado": "Placas-etiquetas"
  },
  {
    "id": "CPEI-T25-OF-65F2E71E",
    "orden": 320,
    "concepto": "Según el ADR 2025, ¿qué dimensiones mínimas debe tener la placa-etiqueta?",
    "respuesta": "250mm x 250mm",
    "fuente": "ADR 2025, 5.3.1.7.1, pág. 810. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=810",
    "localizacion": "ADR 2025, 5.3.1.7.1, pág. 810",
    "apartado": "Placas-etiquetas"
  },
  {
    "id": "CPEI-T25-OF-9E41B2A4",
    "orden": 330,
    "concepto": "Según el ADR 2025, ¿a qué distancia del borde se encuentra la línea interior de la placa-etiqueta?",
    "respuesta": "12,5mm",
    "fuente": "ADR 2025, 5.3.1.7.1, pág. 810. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=810",
    "localizacion": "ADR 2025, 5.3.1.7.1, pág. 810",
    "apartado": "Placas-etiquetas"
  },
  {
    "id": "CPEI-T25-OF-F5191B90",
    "orden": 340,
    "concepto": "Según el ADR 2025, ¿dónde deben llevar placas-etiquetas los vehículos que transporten bultos de la clase 1 (salvo 1.4S)?",
    "respuesta": "Sobre los dos laterales y la trasera del vehículo",
    "fuente": "ADR 2025, 5.3.1.5.1, pág. 810. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=810",
    "localizacion": "ADR 2025, 5.3.1.5.1, pág. 810",
    "apartado": "Placas-etiquetas"
  },
  {
    "id": "CPEI-T25-OF-482BFB79",
    "orden": 350,
    "concepto": "Según el ADR 2025, ¿qué placas-etiquetas deben llevar los vehículos cisterna vacíos, sin limpiar o sin desgasificar?",
    "respuesta": "Las placas-etiquetas requeridas para la carga precedente",
    "fuente": "ADR 2025, 5.3.1.6.1, pág. 810. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=810",
    "localizacion": "ADR 2025, 5.3.1.6.1, pág. 810",
    "apartado": "Placas-etiquetas"
  },
  {
    "id": "CPEI-T25-OF-B0B4CCB9",
    "orden": 360,
    "concepto": "Según el ADR 2025, para las clases 1 y 7, ¿hasta qué lado pueden reducirse las placas-etiquetas si la superficie es insuficiente?",
    "respuesta": "100mm. de lado",
    "fuente": "ADR 2025, 5.3.1.7.4, pág. 811. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=811",
    "localizacion": "ADR 2025, 5.3.1.7.4, pág. 811",
    "apartado": "Placas-etiquetas"
  },
  {
    "id": "CPEI-T25-OF-F9551F48",
    "orden": 370,
    "concepto": "Según el ADR 2025, ¿dónde se llevarán las instrucciones escritas para caso de emergencia?",
    "respuesta": "Al alcance de la mano, en la cabina del vehículo",
    "fuente": "ADR 2025, 5.4.3.1, pág. 830. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=830",
    "localizacion": "ADR 2025, 5.4.3.1, pág. 830",
    "apartado": "Actuación en caso de accidente"
  },
  {
    "id": "CPEI-T25-OF-448BD6B1",
    "orden": 380,
    "concepto": "Según el ADR 2025, ¿quién debe proporcionar las instrucciones escritas a la tripulación del vehículo?",
    "respuesta": "El transportista",
    "fuente": "ADR 2025, 5.4.3.2, pág. 830. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=830",
    "localizacion": "ADR 2025, 5.4.3.2, pág. 830",
    "apartado": "Actuación en caso de accidente"
  },
  {
    "id": "CPEI-T25-OF-2DBA5B29",
    "orden": 390,
    "concepto": "Según el ADR 2025, ¿cuántas páginas tiene el modelo de instrucciones escritas?",
    "respuesta": "Modelo de cuatro páginas",
    "fuente": "ADR 2025, 5.4.3.4, pág. 830. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=830",
    "localizacion": "ADR 2025, 5.4.3.4, pág. 830",
    "apartado": "Actuación en caso de accidente"
  },
  {
    "id": "CPEI-T25-OF-EF7A9BA9",
    "orden": 400,
    "concepto": "Según el ADR 2025, en caso de accidente, ¿qué deben hacer primero los tripulantes con el vehículo?",
    "respuesta": "Aplicar el sistema de frenado, apagar el motor y desconectar la batería accionando el interruptor cuando exista",
    "fuente": "ADR 2025, 5.4.3.4, instrucciones escritas, pág. 831. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=831",
    "localizacion": "ADR 2025, 5.4.3.4, instrucciones escritas, pág. 831",
    "apartado": "Actuación en caso de accidente"
  },
  {
    "id": "CPEI-T25-OF-DF32C1C3",
    "orden": 410,
    "concepto": "Según el ADR 2025, ¿qué incendios pueden apagar los tripulantes con los extintores si es seguro?",
    "respuesta": "Incendios pequeños/iniciales en neumáticos, frenos y compartimento del motor",
    "fuente": "ADR 2025, 5.4.3.4, instrucciones escritas, pág. 831. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=831",
    "localizacion": "ADR 2025, 5.4.3.4, instrucciones escritas, pág. 831",
    "apartado": "Actuación en caso de accidente"
  },
  {
    "id": "CPEI-T25-OF-288334FB",
    "orden": 420,
    "concepto": "Según el ADR 2025, ¿contra qué incendios no deben actuar los miembros de la tripulación?",
    "respuesta": "Los incendios en los compartimentos de carga",
    "fuente": "ADR 2025, 5.4.3.4, instrucciones escritas, pág. 831. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=831",
    "localizacion": "ADR 2025, 5.4.3.4, instrucciones escritas, pág. 831",
    "apartado": "Actuación en caso de accidente"
  },
  {
    "id": "CPEI-T25-OF-01169D47",
    "orden": 430,
    "concepto": "Según el ADR 2025, ¿de qué lado deben mantenerse los tripulantes para evitar inhalar gases, humo o vapores?",
    "respuesta": "En el lado desde donde sopla el viento",
    "fuente": "ADR 2025, 5.4.3.4, instrucciones escritas, pág. 831. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=831",
    "localizacion": "ADR 2025, 5.4.3.4, instrucciones escritas, pág. 831",
    "apartado": "Actuación en caso de accidente"
  },
  {
    "id": "CPEI-T25-OF-9A6FD63B",
    "orden": 440,
    "concepto": "Según el ADR 2025, ante gases tóxicos (2.3), ¿qué equipo indican las instrucciones escritas que se use?",
    "respuesta": "Usar mascara de evacuación de emergencia",
    "fuente": "ADR 2025, 5.4.3.4, indicaciones adicionales, pág. 832. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=832",
    "localizacion": "ADR 2025, 5.4.3.4, indicaciones adicionales, pág. 832",
    "apartado": "Actuación en caso de accidente"
  },
  {
    "id": "CPEI-T25-OF-22C8E0B7",
    "orden": 450,
    "concepto": "Según el ADR 2025, ante materias de la clase 4.3 derramadas, ¿cómo deben taparse?",
    "respuesta": "Se deben tapar de forma que se mantengan separadas del agua",
    "fuente": "ADR 2025, 5.4.3.4, indicaciones adicionales, pág. 832. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=832",
    "localizacion": "ADR 2025, 5.4.3.4, indicaciones adicionales, pág. 832",
    "apartado": "Actuación en caso de accidente"
  },
  {
    "id": "CPEI-T25-OF-2A8C0FE2",
    "orden": 460,
    "concepto": "Según el ADR 2025, ¿cuántas categorías de túneles hay?",
    "respuesta": "Las cinco categorías de túneles",
    "fuente": "ADR 2025, 1.9.5.2.2, pág. 90. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=90",
    "localizacion": "ADR 2025, 1.9.5.2.2, pág. 90",
    "apartado": "Túneles"
  },
  {
    "id": "CPEI-T25-OF-54A3F117",
    "orden": 470,
    "concepto": "Según el ADR 2025, ¿qué restricción tiene la categoría de túnel A?",
    "respuesta": "Ninguna restricción al transporte de mercancías peligrosas",
    "fuente": "ADR 2025, 1.9.5.2.2, pág. 90. BOE-A-2025-77, texto enmendado de los Anejos A y B del ADR 2025 (BOE nº 3, de 03/01/2025); texto íntegro oficial (BOE nº 3 de 03/01/2025, PDF oficial (ficha BOE actualizada a 20/12/2025)): https://www.boe.es/boe/dias/2025/01/03/pdfs/BOE-A-2025-77.pdf#page=90",
    "localizacion": "ADR 2025, 1.9.5.2.2, pág. 90",
    "apartado": "Túneles"
  }
];
