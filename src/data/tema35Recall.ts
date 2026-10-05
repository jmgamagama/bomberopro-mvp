/** Tema 35 recall cards — local subset (150). Do not load tema 36 (528) or full MIRA. */

export type Tema35RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA35_RECALL_META = {
  tema: 35,
  title: "Tema 35 · Red de carreteras de Extremadura (provincia de Badajoz)",
  count: 150,
  source: "Decreto 98/2008 + Extremadura en Cifras (JSON limpio score 100%)",
} as const;

export const TEMA35_RECALL_CARDS: Tema35RecallCard[] = [
  {
    "id": "CPEI-T35-S01-0656D807D7",
    "orden": 10,
    "concepto": "¿Qué contiene el Catálogo de la Red de Carreteras de Extremadura?",
    "respuesta": "La titularidad, categoría y denominación de las carreteras.",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "preámbulo/anexo",
    "apartado": "Conceptos rectores"
  },
  {
    "id": "CPEI-T35-S01-1B0D2BA6DC",
    "orden": 20,
    "concepto": "¿Qué norma aprueba el catálogo autonómico usado como base?",
    "respuesta": "El Decreto 98/2008, de 23 de mayo.",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "preámbulo/anexo",
    "apartado": "Conceptos rectores"
  },
  {
    "id": "CPEI-T35-S01-80CE0AA90F",
    "orden": 30,
    "concepto": "¿Qué prefijo identifica las carreteras autonómicas extremeñas?",
    "respuesta": "EX.",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "preámbulo/anexo",
    "apartado": "Conceptos rectores"
  },
  {
    "id": "CPEI-T35-S01-D067024BDE",
    "orden": 40,
    "concepto": "¿Qué tres categorías ordinarias emplea el catálogo?",
    "respuesta": "Red básica, red intercomarcal y red local.",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "preámbulo/anexo",
    "apartado": "Conceptos rectores"
  },
  {
    "id": "CPEI-T35-S01-D003AEE18E",
    "orden": 50,
    "concepto": "¿Qué prefijo identifica las carreteras provinciales de Badajoz?",
    "respuesta": "BA.",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "preámbulo/anexo",
    "apartado": "Conceptos rectores"
  },
  {
    "id": "CPEI-T35-S01-57F9BFBC83",
    "orden": 60,
    "concepto": "¿Qué administración es titular de A y N de la Red de Carreteras del Estado?",
    "respuesta": "La Administración General del Estado, a través del ministerio competente en carreteras.",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "preámbulo/anexo",
    "apartado": "Conceptos rectores"
  },
  {
    "id": "CPEI-T35-S01-400B30628A",
    "orden": 70,
    "concepto": "¿Qué carreteras estatales estructuran principalmente Badajoz?",
    "respuesta": "A-5, A-66 y A-43; se complementan con N-430, N-432, N-435 y N-630, entre otras.",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "preámbulo/anexo",
    "apartado": "Conceptos rectores"
  },
  {
    "id": "CPEI-T35-S01-7C9D1C35BD",
    "orden": 80,
    "concepto": "¿Qué dato estadístico oficial recoge la red de Badajoz en 2023?",
    "respuesta": "4.875 km en total: 877 km estatales, 2.084 km autonómicos y 1.914 km provinciales/cabildos.",
    "fuente": "Extremadura en cifras 2025",
    "localizacion": "tabla 14.1",
    "apartado": "Conceptos rectores"
  },
  {
    "id": "CPEI-T35-S02-9B0B995852",
    "orden": 90,
    "concepto": "¿Qué itinerario funcional identifica la A-5 en Badajoz?",
    "respuesta": "Madrid–Badajoz–frontera portuguesa",
    "fuente": "Mapa Oficial de Carreteras del Estado 2026",
    "localizacion": "Mapa Oficial de Carreteras 2026",
    "apartado": "Red estatal"
  },
  {
    "id": "CPEI-T35-S02-CF10808E1D",
    "orden": 100,
    "concepto": "¿Qué itinerario funcional identifica la A-66 en Badajoz?",
    "respuesta": "eje norte-sur Ruta de la Plata",
    "fuente": "Mapa Oficial de Carreteras del Estado 2026",
    "localizacion": "Mapa Oficial de Carreteras 2026",
    "apartado": "Red estatal"
  },
  {
    "id": "CPEI-T35-S02-E523923309",
    "orden": 110,
    "concepto": "¿Qué itinerario funcional identifica la A-43 en Badajoz?",
    "respuesta": "eje Extremadura–Comunidad Valenciana, tramo provincial vinculado a N-430",
    "fuente": "Mapa Oficial de Carreteras del Estado 2026",
    "localizacion": "Mapa Oficial de Carreteras 2026",
    "apartado": "Red estatal"
  },
  {
    "id": "CPEI-T35-S02-D4B2322F0F",
    "orden": 120,
    "concepto": "¿Qué itinerario funcional identifica la N-430 en Badajoz?",
    "respuesta": "Badajoz–Valencia por La Serena",
    "fuente": "Mapa Oficial de Carreteras del Estado 2026",
    "localizacion": "Mapa Oficial de Carreteras 2026",
    "apartado": "Red estatal"
  },
  {
    "id": "CPEI-T35-S02-893F0C070F",
    "orden": 130,
    "concepto": "¿Qué itinerario funcional identifica la N-432 en Badajoz?",
    "respuesta": "Badajoz–Granada",
    "fuente": "Mapa Oficial de Carreteras del Estado 2026",
    "localizacion": "Mapa Oficial de Carreteras 2026",
    "apartado": "Red estatal"
  },
  {
    "id": "CPEI-T35-S02-793D357EC3",
    "orden": 140,
    "concepto": "¿Qué itinerario funcional identifica la N-435 en Badajoz?",
    "respuesta": "Badajoz–Huelva",
    "fuente": "Mapa Oficial de Carreteras del Estado 2026",
    "localizacion": "Mapa Oficial de Carreteras 2026",
    "apartado": "Red estatal"
  },
  {
    "id": "CPEI-T35-S02-FB3771E2BF",
    "orden": 150,
    "concepto": "¿Qué itinerario funcional identifica la N-630 en Badajoz?",
    "respuesta": "Gijón–Sevilla por Mérida",
    "fuente": "Mapa Oficial de Carreteras del Estado 2026",
    "localizacion": "Mapa Oficial de Carreteras 2026",
    "apartado": "Red estatal"
  },
  {
    "id": "CPEI-T35-S03-8F72AB1BCD",
    "orden": 160,
    "concepto": "¿Cuál es el itinerario de la EX-A2?",
    "respuesta": "Miajadas–Vegas Altas (Don Benito–Villanueva de la Serena)",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-A2"
  },
  {
    "id": "CPEI-T35-S03-3FDBB48EAA",
    "orden": 170,
    "concepto": "¿Qué categoría tiene la EX-A2?",
    "respuesta": "Autovía autonómica",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-A2"
  },
  {
    "id": "CPEI-T35-S03-BA31045D2B",
    "orden": 180,
    "concepto": "¿Qué longitud catalogada tiene la EX-A2?",
    "respuesta": "21,860 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-A2"
  },
  {
    "id": "CPEI-T35-S03-99DDF8B8E0",
    "orden": 190,
    "concepto": "¿Cuál es el itinerario de la EX-100?",
    "respuesta": "Cáceres–Badajoz",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-100"
  },
  {
    "id": "CPEI-T35-S03-64C861A60E",
    "orden": 200,
    "concepto": "¿Qué categoría tiene la EX-100?",
    "respuesta": "Básica",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-100"
  },
  {
    "id": "CPEI-T35-S03-0A85F1EA8C",
    "orden": 210,
    "concepto": "¿Qué longitud catalogada tiene la EX-100?",
    "respuesta": "87,350 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-100"
  },
  {
    "id": "CPEI-T35-S03-C4B78D66E2",
    "orden": 220,
    "concepto": "¿Cuál es el itinerario de la EX-101?",
    "respuesta": "N-630–Fregenal de la Sierra por Zafra",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-101"
  },
  {
    "id": "CPEI-T35-S03-C8B4209155",
    "orden": 230,
    "concepto": "¿Qué longitud catalogada tiene la EX-101?",
    "respuesta": "45,040 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-101"
  },
  {
    "id": "CPEI-T35-S03-E59D00C62F",
    "orden": 240,
    "concepto": "¿Cuál es el itinerario de la EX-102?",
    "respuesta": "Miajadas–límite de Toledo por Guadalupe",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-102"
  },
  {
    "id": "CPEI-T35-S03-637CF5A341",
    "orden": 250,
    "concepto": "¿Qué longitud catalogada tiene la EX-102?",
    "respuesta": "104,850 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-102"
  },
  {
    "id": "CPEI-T35-S03-F03B951BD3",
    "orden": 260,
    "concepto": "¿Cuál es el itinerario de la EX-103?",
    "respuesta": "Puebla de Alcocer–EX-201 por Llerena",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-103"
  },
  {
    "id": "CPEI-T35-S03-46A5412C5B",
    "orden": 270,
    "concepto": "¿Qué longitud catalogada tiene la EX-103?",
    "respuesta": "206,780 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-103"
  },
  {
    "id": "CPEI-T35-S03-F78E3B0842",
    "orden": 280,
    "concepto": "¿Cuál es el itinerario de la EX-104?",
    "respuesta": "Villanueva de la Serena–límite de Córdoba por Castuera",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-104"
  },
  {
    "id": "CPEI-T35-S03-68B4324399",
    "orden": 290,
    "concepto": "¿Qué longitud catalogada tiene la EX-104?",
    "respuesta": "79,240 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-104"
  },
  {
    "id": "CPEI-T35-S03-A7AED0453E",
    "orden": 300,
    "concepto": "¿Cuál es el itinerario de la EX-105?",
    "respuesta": "Don Benito–Portugal por Almendralejo",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-105"
  },
  {
    "id": "CPEI-T35-S03-0E3DA523A0",
    "orden": 310,
    "concepto": "¿Qué longitud catalogada tiene la EX-105?",
    "respuesta": "150,740 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-105"
  },
  {
    "id": "CPEI-T35-S03-B30D4147FA",
    "orden": 320,
    "concepto": "¿Cuál es el itinerario de la EX-106?",
    "respuesta": "Miajadas–Don Benito",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-106"
  },
  {
    "id": "CPEI-T35-S03-3040DC78D4",
    "orden": 330,
    "concepto": "¿Qué longitud catalogada tiene la EX-106?",
    "respuesta": "22,520 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-106"
  },
  {
    "id": "CPEI-T35-S03-E73D75444B",
    "orden": 340,
    "concepto": "¿Cuál es el itinerario de la EX-107?",
    "respuesta": "Badajoz–Portugal por Villanueva del Fresno",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-107"
  },
  {
    "id": "CPEI-T35-S03-679D80F3A5",
    "orden": 350,
    "concepto": "¿Qué longitud catalogada tiene la EX-107?",
    "respuesta": "71,620 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-107"
  },
  {
    "id": "CPEI-T35-S03-06B12F7DC6",
    "orden": 360,
    "concepto": "¿Cuál es el itinerario de la EX-110?",
    "respuesta": "Valencia de Alcántara–Badajoz",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-110"
  },
  {
    "id": "CPEI-T35-S03-89E8BCF879",
    "orden": 370,
    "concepto": "¿Qué longitud catalogada tiene la EX-110?",
    "respuesta": "69,570 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-110"
  },
  {
    "id": "CPEI-T35-S03-F336E395E8",
    "orden": 380,
    "concepto": "¿Cuál es el itinerario de la EX-111?",
    "respuesta": "Azuaga–EX-103 por Zalamea de la Serena",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-111"
  },
  {
    "id": "CPEI-T35-S03-408916C5B9",
    "orden": 390,
    "concepto": "¿Qué longitud catalogada tiene la EX-111?",
    "respuesta": "47,250 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-111"
  },
  {
    "id": "CPEI-T35-S03-531C4D2FBB",
    "orden": 400,
    "concepto": "¿Cuál es el itinerario de la EX-112?",
    "respuesta": "Zafra–Villanueva del Fresno",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-112"
  },
  {
    "id": "CPEI-T35-S03-1E93C64772",
    "orden": 410,
    "concepto": "¿Qué longitud catalogada tiene la EX-112?",
    "respuesta": "71,400 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-112"
  },
  {
    "id": "CPEI-T35-S03-838F2EADE1",
    "orden": 420,
    "concepto": "¿Cuál es el itinerario de la EX-114?",
    "respuesta": "EX-103–Quintana de la Serena",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-114"
  },
  {
    "id": "CPEI-T35-S03-5DDFFC4C9B",
    "orden": 430,
    "concepto": "¿Qué longitud catalogada tiene la EX-114?",
    "respuesta": "8,970 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-114"
  },
  {
    "id": "CPEI-T35-S03-7B2B0E7835",
    "orden": 440,
    "concepto": "¿Cuál es el itinerario de la EX-115?",
    "respuesta": "N-430–Quintana de la Serena",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-115"
  },
  {
    "id": "CPEI-T35-S03-20C9BFBA58",
    "orden": 450,
    "concepto": "¿Qué longitud catalogada tiene la EX-115?",
    "respuesta": "50,770 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-115"
  },
  {
    "id": "CPEI-T35-S03-ADA08DDB82",
    "orden": 460,
    "concepto": "¿Cuál es el itinerario de la EX-116?",
    "respuesta": "N-430–EX-102 por Puerto Llano",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-116"
  },
  {
    "id": "CPEI-T35-S03-4CA0E2CF23",
    "orden": 470,
    "concepto": "¿Qué longitud catalogada tiene la EX-116?",
    "respuesta": "34,640 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-116"
  },
  {
    "id": "CPEI-T35-S04-5C107B3EE6",
    "orden": 480,
    "concepto": "¿Cuál es el itinerario de la EX-200?",
    "respuesta": "Llerena–límite de Sevilla (Guadalcanal)",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-200"
  },
  {
    "id": "CPEI-T35-S04-60864F0458",
    "orden": 490,
    "concepto": "¿Qué categoría tiene la EX-200?",
    "respuesta": "Intercomarcal",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-200"
  },
  {
    "id": "CPEI-T35-S04-4DF580188C",
    "orden": 500,
    "concepto": "¿Qué longitud catalogada tiene la EX-200?",
    "respuesta": "16,530 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-200"
  },
  {
    "id": "CPEI-T35-S04-5A8B5A5B6C",
    "orden": 510,
    "concepto": "¿Cuál es el itinerario de la EX-201?",
    "respuesta": "límite de Huelva (Santa Olalla)–Fregenal de la Sierra",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-201"
  },
  {
    "id": "CPEI-T35-S04-BEFA101EC9",
    "orden": 520,
    "concepto": "¿Qué longitud catalogada tiene la EX-201?",
    "respuesta": "23,060 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-201"
  },
  {
    "id": "CPEI-T35-S04-213BD3E57E",
    "orden": 530,
    "concepto": "¿Cuál es el itinerario de la EX-202?",
    "respuesta": "Valencia de las Torres–Segura de León",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-202"
  },
  {
    "id": "CPEI-T35-S04-C0C6567C8C",
    "orden": 540,
    "concepto": "¿Qué longitud catalogada tiene la EX-202?",
    "respuesta": "61,740 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-202"
  },
  {
    "id": "CPEI-T35-S04-23D14749E6",
    "orden": 550,
    "concepto": "¿Cuál es el itinerario de la EX-206?",
    "respuesta": "Cáceres–Villanueva de la Serena",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-206"
  },
  {
    "id": "CPEI-T35-S04-6FDB1E7982",
    "orden": 560,
    "concepto": "¿Qué longitud catalogada tiene la EX-206?",
    "respuesta": "87,661 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-206"
  },
  {
    "id": "CPEI-T35-S04-2563A34D25",
    "orden": 570,
    "concepto": "¿Cuál es el itinerario de la EX-209?",
    "respuesta": "Badajoz–Mérida por Montijo",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-209"
  },
  {
    "id": "CPEI-T35-S04-2C2089EACB",
    "orden": 580,
    "concepto": "¿Qué longitud catalogada tiene la EX-209?",
    "respuesta": "57,070 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-209"
  },
  {
    "id": "CPEI-T35-S04-299FC895E7",
    "orden": 590,
    "concepto": "¿Cuál es el itinerario de la EX-210?",
    "respuesta": "Palomas–EX-103",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-210"
  },
  {
    "id": "CPEI-T35-S04-BB8EBF8068",
    "orden": 600,
    "concepto": "¿Qué longitud catalogada tiene la EX-210?",
    "respuesta": "38,380 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-210"
  },
  {
    "id": "CPEI-T35-S04-B8FE6562FB",
    "orden": 610,
    "concepto": "¿Cuál es el itinerario de la EX-211?",
    "respuesta": "EX-103–límite de Córdoba por Monterrubio de la Serena",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-211"
  },
  {
    "id": "CPEI-T35-S04-8DF3D1D89F",
    "orden": 620,
    "concepto": "¿Qué longitud catalogada tiene la EX-211?",
    "respuesta": "54,760 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-211"
  },
  {
    "id": "CPEI-T35-S04-4EFB5D77D7",
    "orden": 630,
    "concepto": "¿Cuál es el itinerario de la EX-212?",
    "respuesta": "Almendralejo–Palomas",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-212"
  },
  {
    "id": "CPEI-T35-S04-EE79BEEA71",
    "orden": 640,
    "concepto": "¿Qué longitud catalogada tiene la EX-212?",
    "respuesta": "25,270 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-212"
  },
  {
    "id": "CPEI-T35-S04-132C21EA5B",
    "orden": 650,
    "concepto": "¿Cuál es el itinerario de la EX-214?",
    "respuesta": "A-66–Alburquerque por La Roca de la Sierra",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-214"
  },
  {
    "id": "CPEI-T35-S04-113D6702CD",
    "orden": 660,
    "concepto": "¿Qué longitud catalogada tiene la EX-214?",
    "respuesta": "60,970 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-214"
  },
  {
    "id": "CPEI-T35-S05-3F83EE0B52",
    "orden": 670,
    "concepto": "¿Cuál es el itinerario de la EX-300?",
    "respuesta": "Badajoz–Almendralejo",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-300"
  },
  {
    "id": "CPEI-T35-S05-385B57F437",
    "orden": 680,
    "concepto": "¿Qué categoría tiene la EX-300?",
    "respuesta": "Local",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-300"
  },
  {
    "id": "CPEI-T35-S05-CAC01A2F26",
    "orden": 690,
    "concepto": "¿Qué longitud catalogada tiene la EX-300?",
    "respuesta": "30,940 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-300"
  },
  {
    "id": "CPEI-T35-S05-0B0DFCDC75",
    "orden": 700,
    "concepto": "¿Cuál es el itinerario de la EX-307?",
    "respuesta": "Mérida–Guareña",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-307"
  },
  {
    "id": "CPEI-T35-S05-09B970B5B8",
    "orden": 710,
    "concepto": "¿Qué longitud catalogada tiene la EX-307?",
    "respuesta": "21,040 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-307"
  },
  {
    "id": "CPEI-T35-S05-8AD2388664",
    "orden": 720,
    "concepto": "¿Cuál es el itinerario de la EX-308?",
    "respuesta": "Azuaga–límite de Córdoba",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-308"
  },
  {
    "id": "CPEI-T35-S05-55E69D0B23",
    "orden": 730,
    "concepto": "¿Qué longitud catalogada tiene la EX-308?",
    "respuesta": "18,760 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-308"
  },
  {
    "id": "CPEI-T35-S05-28306B42A5",
    "orden": 740,
    "concepto": "¿Cuál es el itinerario de la EX-309?",
    "respuesta": "N-432–límite de Sevilla por Valverde de Llerena",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-309"
  },
  {
    "id": "CPEI-T35-S05-9153124AFB",
    "orden": 750,
    "concepto": "¿Qué longitud catalogada tiene la EX-309?",
    "respuesta": "16,630 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-309"
  },
  {
    "id": "CPEI-T35-S05-2F6E007F19",
    "orden": 760,
    "concepto": "¿Cuál es el itinerario de la EX-310?",
    "respuesta": "Badajoz–Valverde de Leganés",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-310"
  },
  {
    "id": "CPEI-T35-S05-FA751954CA",
    "orden": 770,
    "concepto": "¿Qué longitud catalogada tiene la EX-310?",
    "respuesta": "24,470 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-310"
  },
  {
    "id": "CPEI-T35-S05-945ACA872D",
    "orden": 780,
    "concepto": "¿Cuál es el itinerario de la EX-311?",
    "respuesta": "N-435–Higuera de Vargas",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-311"
  },
  {
    "id": "CPEI-T35-S05-7A99EA8DEE",
    "orden": 790,
    "concepto": "¿Qué longitud catalogada tiene la EX-311?",
    "respuesta": "14,150 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-311"
  },
  {
    "id": "CPEI-T35-S05-A5F027B519",
    "orden": 800,
    "concepto": "¿Cuál es el itinerario de la EX-312?",
    "respuesta": "EX-107–Higuera de Vargas",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-312"
  },
  {
    "id": "CPEI-T35-S05-8B3E1FF3B7",
    "orden": 810,
    "concepto": "¿Qué longitud catalogada tiene la EX-312?",
    "respuesta": "11,650 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-312"
  },
  {
    "id": "CPEI-T35-S05-2EFF21DB7F",
    "orden": 820,
    "concepto": "¿Cuál es el itinerario de la EX-313?",
    "respuesta": "Barcarrota–Alconchel",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-313"
  },
  {
    "id": "CPEI-T35-S05-1A5050598F",
    "orden": 830,
    "concepto": "¿Qué longitud catalogada tiene la EX-313?",
    "respuesta": "21,110 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-313"
  },
  {
    "id": "CPEI-T35-S05-8B17D6FF35",
    "orden": 840,
    "concepto": "¿Cuál es el itinerario de la EX-314?",
    "respuesta": "Alconchel–Cheles",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-314"
  },
  {
    "id": "CPEI-T35-S05-5C6AD7DCC6",
    "orden": 850,
    "concepto": "¿Qué longitud catalogada tiene la EX-314?",
    "respuesta": "18,610 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-314"
  },
  {
    "id": "CPEI-T35-S05-462616F0FB",
    "orden": 860,
    "concepto": "¿Cuál es el itinerario de la EX-315?",
    "respuesta": "Olivenza–Cheles",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-315"
  },
  {
    "id": "CPEI-T35-S05-E04C1D3544",
    "orden": 870,
    "concepto": "¿Qué longitud catalogada tiene la EX-315?",
    "respuesta": "25,460 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-315"
  },
  {
    "id": "CPEI-T35-S05-8A5F04D4EF",
    "orden": 880,
    "concepto": "¿Cuál es el itinerario de la EX-316?",
    "respuesta": "EX-116–Castilblanco por Valdecaballeros",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-316"
  },
  {
    "id": "CPEI-T35-S05-75A57FB066",
    "orden": 890,
    "concepto": "¿Qué longitud catalogada tiene la EX-316?",
    "respuesta": "26,120 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-316"
  },
  {
    "id": "CPEI-T35-S05-D5D0669441",
    "orden": 900,
    "concepto": "¿Cuál es el itinerario de la EX-317?",
    "respuesta": "Oliva de la Frontera–límite de Huelva",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-317"
  },
  {
    "id": "CPEI-T35-S05-5852370AE3",
    "orden": 910,
    "concepto": "¿Qué longitud catalogada tiene la EX-317?",
    "respuesta": "13,226 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-317"
  },
  {
    "id": "CPEI-T35-S05-849D888FBE",
    "orden": 920,
    "concepto": "¿Cuál es el itinerario de la EX-320?",
    "respuesta": "Zafra–Barcarrota",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-320"
  },
  {
    "id": "CPEI-T35-S05-7734E88BB6",
    "orden": 930,
    "concepto": "¿Qué longitud catalogada tiene la EX-320?",
    "respuesta": "48,570 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-320"
  },
  {
    "id": "CPEI-T35-S05-5D8C51A827",
    "orden": 940,
    "concepto": "¿Cuál es el itinerario de la EX-322?",
    "respuesta": "Cabeza del Buey–Puebla de Alcocer",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-322"
  },
  {
    "id": "CPEI-T35-S05-CC93255E20",
    "orden": 950,
    "concepto": "¿Qué longitud catalogada tiene la EX-322?",
    "respuesta": "35,430 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-322"
  },
  {
    "id": "CPEI-T35-S05-667D938AF2",
    "orden": 960,
    "concepto": "¿Cuál es el itinerario de la EX-323?",
    "respuesta": "Cabeza del Buey–límite de Ciudad Real por Zarza Capilla",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-323"
  },
  {
    "id": "CPEI-T35-S05-FA690BB25E",
    "orden": 970,
    "concepto": "¿Qué longitud catalogada tiene la EX-323?",
    "respuesta": "33,140 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-323"
  },
  {
    "id": "CPEI-T35-S05-EF6C3668E1",
    "orden": 980,
    "concepto": "¿Cuál es el itinerario de la EX-324?",
    "respuesta": "Helechal–Monterrubio de la Serena",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-324"
  },
  {
    "id": "CPEI-T35-S05-F3EEB31F49",
    "orden": 990,
    "concepto": "¿Qué longitud catalogada tiene la EX-324?",
    "respuesta": "11,300 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-324"
  },
  {
    "id": "CPEI-T35-S05-252BF56D2B",
    "orden": 1000,
    "concepto": "¿Cuál es el itinerario de la EX-325?",
    "respuesta": "EX-110–EX-303 por Villar del Rey",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-325"
  },
  {
    "id": "CPEI-T35-S05-BB41D3F281",
    "orden": 1010,
    "concepto": "¿Qué longitud catalogada tiene la EX-325?",
    "respuesta": "37,650 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-325"
  },
  {
    "id": "CPEI-T35-S05-E072F7A18F",
    "orden": 1020,
    "concepto": "¿Cuál es el itinerario de la EX-327?",
    "respuesta": "La Roca de la Sierra–Montijo",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-327"
  },
  {
    "id": "CPEI-T35-S05-A88BDFD4CB",
    "orden": 1030,
    "concepto": "¿Qué longitud catalogada tiene la EX-327?",
    "respuesta": "25,050 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-327"
  },
  {
    "id": "CPEI-T35-S05-EBDABA0470",
    "orden": 1040,
    "concepto": "¿Cuál es el itinerario de la EX-328?",
    "respuesta": "A-5–Montijo",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-328"
  },
  {
    "id": "CPEI-T35-S05-7313014D5F",
    "orden": 1050,
    "concepto": "¿Qué longitud catalogada tiene la EX-328?",
    "respuesta": "5,030 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-328"
  },
  {
    "id": "CPEI-T35-S05-4C0BC8A14B",
    "orden": 1060,
    "concepto": "¿Cuál es el itinerario de la EX-330?",
    "respuesta": "Ronda de Badajoz",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-330"
  },
  {
    "id": "CPEI-T35-S05-4E0103FACF",
    "orden": 1070,
    "concepto": "¿Qué longitud catalogada tiene la EX-330?",
    "respuesta": "4,644 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-330"
  },
  {
    "id": "CPEI-T35-S05-785DB17AF9",
    "orden": 1080,
    "concepto": "¿Cuál es el itinerario de la EX-334?",
    "respuesta": "Villafranca de los Barros–Palomas",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-334"
  },
  {
    "id": "CPEI-T35-S05-D36F872A0D",
    "orden": 1090,
    "concepto": "¿Qué longitud catalogada tiene la EX-334?",
    "respuesta": "26,740 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-334"
  },
  {
    "id": "CPEI-T35-S05-F939E4A39B",
    "orden": 1100,
    "concepto": "¿Cuál es el itinerario de la EX-335?",
    "respuesta": "Palomas–Oliva de Mérida",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-335"
  },
  {
    "id": "CPEI-T35-S05-8450B7F7A3",
    "orden": 1110,
    "concepto": "¿Qué longitud catalogada tiene la EX-335?",
    "respuesta": "12,330 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-335"
  },
  {
    "id": "CPEI-T35-S05-9AC0F7869E",
    "orden": 1120,
    "concepto": "¿Cuál es el itinerario de la EX-336?",
    "respuesta": "Villagonzalo–Oliva de Mérida",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-336"
  },
  {
    "id": "CPEI-T35-S05-7CE81F96E2",
    "orden": 1130,
    "concepto": "¿Qué longitud catalogada tiene la EX-336?",
    "respuesta": "10,270 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-336"
  },
  {
    "id": "CPEI-T35-S05-EDD5355740",
    "orden": 1140,
    "concepto": "¿Cuál es el itinerario de la EX-337?",
    "respuesta": "EX-105–EX-212",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-337"
  },
  {
    "id": "CPEI-T35-S05-8709F13770",
    "orden": 1150,
    "concepto": "¿Qué longitud catalogada tiene la EX-337?",
    "respuesta": "13,100 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-337"
  },
  {
    "id": "CPEI-T35-S05-60C7494B82",
    "orden": 1160,
    "concepto": "¿Cuál es el itinerario de la EX-338?",
    "respuesta": "Guareña–Oliva de Mérida",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-338"
  },
  {
    "id": "CPEI-T35-S05-02FED9DE79",
    "orden": 1170,
    "concepto": "¿Qué longitud catalogada tiene la EX-338?",
    "respuesta": "8,530 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-338"
  },
  {
    "id": "CPEI-T35-S05-EC997783D5",
    "orden": 1180,
    "concepto": "¿Cuál es el itinerario de la EX-342?",
    "respuesta": "Villafranca de los Barros–Hornachos",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-342"
  },
  {
    "id": "CPEI-T35-S05-606ADB6676",
    "orden": 1190,
    "concepto": "¿Qué longitud catalogada tiene la EX-342?",
    "respuesta": "24,940 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-342"
  },
  {
    "id": "CPEI-T35-S05-FB0A65091A",
    "orden": 1200,
    "concepto": "¿Cuál es el itinerario de la EX-343?",
    "respuesta": "EX-103–Hornachos",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-343"
  },
  {
    "id": "CPEI-T35-S05-F265EEA12E",
    "orden": 1210,
    "concepto": "¿Qué longitud catalogada tiene la EX-343?",
    "respuesta": "19,560 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-343"
  },
  {
    "id": "CPEI-T35-S05-B55FE35D09",
    "orden": 1220,
    "concepto": "¿Cuál es el itinerario de la EX-344?",
    "respuesta": "Puebla de la Reina–Hornachos",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-344"
  },
  {
    "id": "CPEI-T35-S05-A8627CDEA3",
    "orden": 1230,
    "concepto": "¿Qué longitud catalogada tiene la EX-344?",
    "respuesta": "13,660 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-344"
  },
  {
    "id": "CPEI-T35-S05-2D19EAE9F7",
    "orden": 1240,
    "concepto": "¿Cuál es el itinerario de la EX-345?",
    "respuesta": "Don Benito–Higuera de la Serena",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-345"
  },
  {
    "id": "CPEI-T35-S05-B877F43134",
    "orden": 1250,
    "concepto": "¿Qué longitud catalogada tiene la EX-345?",
    "respuesta": "42,538 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-345"
  },
  {
    "id": "CPEI-T35-S05-5D7867221F",
    "orden": 1260,
    "concepto": "¿Cuál es el itinerario de la EX-346?",
    "respuesta": "Don Benito–Quintana de la Serena",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-346"
  },
  {
    "id": "CPEI-T35-S05-98EF222A74",
    "orden": 1270,
    "concepto": "¿Qué longitud catalogada tiene la EX-346?",
    "respuesta": "30,370 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-346"
  },
  {
    "id": "CPEI-T35-S05-11F894CDF3",
    "orden": 1280,
    "concepto": "¿Cuál es el itinerario de la EX-347?",
    "respuesta": "Villanueva de la Serena–La Haba",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-347"
  },
  {
    "id": "CPEI-T35-S05-BE75564A50",
    "orden": 1290,
    "concepto": "¿Qué longitud catalogada tiene la EX-347?",
    "respuesta": "4,900 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-347"
  },
  {
    "id": "CPEI-T35-S05-86C9879162",
    "orden": 1300,
    "concepto": "¿Cuál es el itinerario de la EX-348?",
    "respuesta": "EX-115–EX-346 por La Coronada",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-348"
  },
  {
    "id": "CPEI-T35-S05-BA02C041E8",
    "orden": 1310,
    "concepto": "¿Qué longitud catalogada tiene la EX-348?",
    "respuesta": "19,220 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-348"
  },
  {
    "id": "CPEI-T35-S05-2EF59A5820",
    "orden": 1320,
    "concepto": "¿Cuál es el itinerario de la EX-349?",
    "respuesta": "Campanario–EX-103",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-349"
  },
  {
    "id": "CPEI-T35-S05-3799DB6D7E",
    "orden": 1330,
    "concepto": "¿Qué longitud catalogada tiene la EX-349?",
    "respuesta": "16,470 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-349"
  },
  {
    "id": "CPEI-T35-S05-B10BE62286",
    "orden": 1340,
    "concepto": "¿Cuál es el itinerario de la EX-351?",
    "respuesta": "N-430–Villanueva de la Serena",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-351"
  },
  {
    "id": "CPEI-T35-S05-03B8E8FB5D",
    "orden": 1350,
    "concepto": "¿Qué longitud catalogada tiene la EX-351?",
    "respuesta": "6,330 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-351"
  },
  {
    "id": "CPEI-T35-S05-2D149A87D0",
    "orden": 1360,
    "concepto": "¿Cuál es el itinerario de la EX-352?",
    "respuesta": "Circunvalación este de Villanueva de la Serena",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-352"
  },
  {
    "id": "CPEI-T35-S05-72BA4F946C",
    "orden": 1370,
    "concepto": "¿Qué longitud catalogada tiene la EX-352?",
    "respuesta": "2,600 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-352"
  },
  {
    "id": "CPEI-T35-S05-3CCCB8C2A9",
    "orden": 1380,
    "concepto": "¿Cuál es el itinerario de la EX-359?",
    "respuesta": "Circunvalación oeste de Almendralejo",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-359"
  },
  {
    "id": "CPEI-T35-S05-B2AA147A75",
    "orden": 1390,
    "concepto": "¿Qué longitud catalogada tiene la EX-359?",
    "respuesta": "11,280 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-359"
  },
  {
    "id": "CPEI-T35-S05-2215AB16BE",
    "orden": 1400,
    "concepto": "¿Cuál es el itinerario de la EX-360?",
    "respuesta": "N-630–Fuente del Maestre",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-360"
  },
  {
    "id": "CPEI-T35-S05-D692FEE3CA",
    "orden": 1410,
    "concepto": "¿Qué longitud catalogada tiene la EX-360?",
    "respuesta": "10,050 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-360"
  },
  {
    "id": "CPEI-T35-S05-FD3811B463",
    "orden": 1420,
    "concepto": "¿Cuál es el itinerario de la EX-361?",
    "respuesta": "Villalba de los Barros–Fuente del Maestre",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-361"
  },
  {
    "id": "CPEI-T35-S05-85A1672BC5",
    "orden": 1430,
    "concepto": "¿Qué longitud catalogada tiene la EX-361?",
    "respuesta": "12,220 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-361"
  },
  {
    "id": "CPEI-T35-S05-A0276025FC",
    "orden": 1440,
    "concepto": "¿Cuál es el itinerario de la EX-362?",
    "respuesta": "N-432–Fuente del Maestre",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-362"
  },
  {
    "id": "CPEI-T35-S05-EA9C5AE518",
    "orden": 1450,
    "concepto": "¿Qué longitud catalogada tiene la EX-362?",
    "respuesta": "6,690 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-362"
  },
  {
    "id": "CPEI-T35-S05-66F046EADA",
    "orden": 1460,
    "concepto": "¿Cuál es el itinerario de la EX-363?",
    "respuesta": "Talavera la Real–La Albuera",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-363"
  },
  {
    "id": "CPEI-T35-S05-4D6698FAB6",
    "orden": 1470,
    "concepto": "¿Qué longitud catalogada tiene la EX-363?",
    "respuesta": "19,070 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-363"
  },
  {
    "id": "CPEI-T35-S05-95AE5FDE91",
    "orden": 1480,
    "concepto": "¿Cuál es el itinerario de la EX-364?",
    "respuesta": "N-432–Los Santos de Maimona",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-364"
  },
  {
    "id": "CPEI-T35-S05-143CA1CFF4",
    "orden": 1490,
    "concepto": "¿Qué longitud catalogada tiene la EX-364?",
    "respuesta": "4,320 km",
    "fuente": "Decreto 98/2008, catálogo de carreteras de la Junta de Extremadura",
    "localizacion": "Decreto 98/2008, anexo",
    "apartado": "EX-364"
  },
  {
    "id": "CPEI-T35-S06-B66B5BD039",
    "orden": 1500,
    "concepto": "¿Qué secuencia debe aplicarse para localizar un siniestro por carretera?",
    "respuesta": "Identificar titularidad y clave → sentido e hitos → punto kilométrico → acceso seguro → parque/zona operativa → ruta alternativa.",
    "fuente": "Mapa Oficial de Carreteras del Estado 2026",
    "localizacion": "criterio operativo de lectura cartográfica",
    "apartado": "Método de lectura"
  },
];
