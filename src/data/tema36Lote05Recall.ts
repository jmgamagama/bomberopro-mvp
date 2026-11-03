/** Tema 36 lote 05 recall cards — local subset (50). Self-contained: do not load all 528 tema 36 cards nor the other lotes (lote 01, lote 02, lote 03, lote 04, lote 06, lote 07, lote 08). */

export type Tema36Lote05RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA36_LOTE05_RECALL_META = {
  tema: 36,
  lote: "lote05",
  title: "Tema 36 · Lote 05 — Municipios restantes (INE + población ≤5.000): Usagre → Zarza-Capilla",
  count: 50,
  source: "tema36_fichas.json + tema36_lotes.json",
} as const;

export const TEMA36_LOTE05_RECALL_CARDS: Tema36Lote05RecallCard[] = [
  {
    "id": "CPEI-T36-S02-3E904D9066",
    "orden": 2770,
    "concepto": "¿Cuál es el código INE del municipio de Usagre?",
    "respuesta": "06136",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Usagre"
  },
  {
    "id": "CPEI-T36-S02-8F5896DF27",
    "orden": 2780,
    "concepto": "¿Qué población oficial tenía Usagre a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.698 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Usagre"
  },
  {
    "id": "CPEI-T36-S02-262765F578",
    "orden": 2790,
    "concepto": "¿Cuál es el código INE del municipio de Valdecaballeros?",
    "respuesta": "06137",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Valdecaballeros"
  },
  {
    "id": "CPEI-T36-S02-DE39387B82",
    "orden": 2800,
    "concepto": "¿Qué población oficial tenía Valdecaballeros a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.036 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Valdecaballeros"
  },
  {
    "id": "CPEI-T36-S02-FCCD9B2836",
    "orden": 2810,
    "concepto": "¿Cuál es el código INE del municipio de Valdelacalzada?",
    "respuesta": "06901",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Valdelacalzada"
  },
  {
    "id": "CPEI-T36-S02-4423C97770",
    "orden": 2820,
    "concepto": "¿Qué población oficial tenía Valdelacalzada a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "2.743 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Valdelacalzada"
  },
  {
    "id": "CPEI-T36-S02-853A101A49",
    "orden": 2830,
    "concepto": "¿Cuál es el código INE del municipio de Valdetorres?",
    "respuesta": "06138",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Valdetorres"
  },
  {
    "id": "CPEI-T36-S02-2D6BFD9BA5",
    "orden": 2840,
    "concepto": "¿Qué población oficial tenía Valdetorres a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.105 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Valdetorres"
  },
  {
    "id": "CPEI-T36-S02-C21C49F32D",
    "orden": 2850,
    "concepto": "¿Cuál es el código INE del municipio de Valencia de las Torres?",
    "respuesta": "06139",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Valencia de las Torres"
  },
  {
    "id": "CPEI-T36-S02-B5D04E20B6",
    "orden": 2860,
    "concepto": "¿Qué población oficial tenía Valencia de las Torres a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "486 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Valencia de las Torres"
  },
  {
    "id": "CPEI-T36-S02-D13D92812A",
    "orden": 2870,
    "concepto": "¿Cuál es el código INE del municipio de Valencia del Mombuey?",
    "respuesta": "06140",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Valencia del Mombuey"
  },
  {
    "id": "CPEI-T36-S02-D140FE5E79",
    "orden": 2880,
    "concepto": "¿Qué población oficial tenía Valencia del Mombuey a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "703 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Valencia del Mombuey"
  },
  {
    "id": "CPEI-T36-S02-0A6A5DCC8F",
    "orden": 2890,
    "concepto": "¿Cuál es el código INE del municipio de Valencia del Ventoso?",
    "respuesta": "06141",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Valencia del Ventoso"
  },
  {
    "id": "CPEI-T36-S02-C46B29321E",
    "orden": 2900,
    "concepto": "¿Qué población oficial tenía Valencia del Ventoso a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.870 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Valencia del Ventoso"
  },
  {
    "id": "CPEI-T36-S02-73F6C9D642",
    "orden": 2910,
    "concepto": "¿Cuál es el código INE del municipio de Valle de Matamoros?",
    "respuesta": "06147",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Valle de Matamoros"
  },
  {
    "id": "CPEI-T36-S02-538E60BD44",
    "orden": 2920,
    "concepto": "¿Qué población oficial tenía Valle de Matamoros a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "337 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Valle de Matamoros"
  },
  {
    "id": "CPEI-T36-S02-2B7DEA4AC8",
    "orden": 2930,
    "concepto": "¿Cuál es el código INE del municipio de Valle de Santa Ana?",
    "respuesta": "06148",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Valle de Santa Ana"
  },
  {
    "id": "CPEI-T36-S02-20C9B0EDD2",
    "orden": 2940,
    "concepto": "¿Qué población oficial tenía Valle de Santa Ana a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.090 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Valle de Santa Ana"
  },
  {
    "id": "CPEI-T36-S02-B77D88C7BF",
    "orden": 2950,
    "concepto": "¿Cuál es el código INE del municipio de Valle de la Serena?",
    "respuesta": "06146",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Valle de la Serena"
  },
  {
    "id": "CPEI-T36-S02-8625ACC4F4",
    "orden": 2960,
    "concepto": "¿Qué población oficial tenía Valle de la Serena a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.075 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Valle de la Serena"
  },
  {
    "id": "CPEI-T36-S02-9D6594229B",
    "orden": 2970,
    "concepto": "¿Cuál es el código INE del municipio de Valverde de Burguillos?",
    "respuesta": "06142",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Valverde de Burguillos"
  },
  {
    "id": "CPEI-T36-S02-DE8F04F336",
    "orden": 2980,
    "concepto": "¿Qué población oficial tenía Valverde de Burguillos a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "260 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Valverde de Burguillos"
  },
  {
    "id": "CPEI-T36-S02-3CEDD4FF84",
    "orden": 2990,
    "concepto": "¿Cuál es el código INE del municipio de Valverde de Leganés?",
    "respuesta": "06143",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Valverde de Leganés"
  },
  {
    "id": "CPEI-T36-S02-3920BB5394",
    "orden": 3000,
    "concepto": "¿Qué población oficial tenía Valverde de Leganés a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "4.230 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Valverde de Leganés"
  },
  {
    "id": "CPEI-T36-S02-E10E7EECEF",
    "orden": 3010,
    "concepto": "¿Cuál es el código INE del municipio de Valverde de Llerena?",
    "respuesta": "06144",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Valverde de Llerena"
  },
  {
    "id": "CPEI-T36-S02-15DE344309",
    "orden": 3020,
    "concepto": "¿Qué población oficial tenía Valverde de Llerena a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "560 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Valverde de Llerena"
  },
  {
    "id": "CPEI-T36-S02-EFB34911C2",
    "orden": 3030,
    "concepto": "¿Cuál es el código INE del municipio de Valverde de Mérida?",
    "respuesta": "06145",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Valverde de Mérida"
  },
  {
    "id": "CPEI-T36-S02-0A9707BF2B",
    "orden": 3040,
    "concepto": "¿Qué población oficial tenía Valverde de Mérida a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.002 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Valverde de Mérida"
  },
  {
    "id": "CPEI-T36-S02-0746E94BDE",
    "orden": 3070,
    "concepto": "¿Cuál es el código INE del municipio de Villagarcía de la Torre?",
    "respuesta": "06150",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Villagarcía de la Torre"
  },
  {
    "id": "CPEI-T36-S02-6DDDC98C18",
    "orden": 3080,
    "concepto": "¿Qué población oficial tenía Villagarcía de la Torre a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "909 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Villagarcía de la Torre"
  },
  {
    "id": "CPEI-T36-S02-4BA3F1C115",
    "orden": 3090,
    "concepto": "¿Cuál es el código INE del municipio de Villagonzalo?",
    "respuesta": "06151",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Villagonzalo"
  },
  {
    "id": "CPEI-T36-S02-CD51EE396C",
    "orden": 3100,
    "concepto": "¿Qué población oficial tenía Villagonzalo a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.226 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Villagonzalo"
  },
  {
    "id": "CPEI-T36-S02-8524F80628",
    "orden": 3110,
    "concepto": "¿Cuál es el código INE del municipio de Villalba de los Barros?",
    "respuesta": "06152",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Villalba de los Barros"
  },
  {
    "id": "CPEI-T36-S02-F2F9E20314",
    "orden": 3120,
    "concepto": "¿Qué población oficial tenía Villalba de los Barros a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.429 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Villalba de los Barros"
  },
  {
    "id": "CPEI-T36-S02-6A0E94F59D",
    "orden": 3150,
    "concepto": "¿Cuál es el código INE del municipio de Villanueva del Fresno?",
    "respuesta": "06154",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Villanueva del Fresno"
  },
  {
    "id": "CPEI-T36-S02-A14C69FC73",
    "orden": 3160,
    "concepto": "¿Qué población oficial tenía Villanueva del Fresno a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "3.247 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Villanueva del Fresno"
  },
  {
    "id": "CPEI-T36-S02-5057CACF71",
    "orden": 3170,
    "concepto": "¿Cuál es el código INE del municipio de Villar de Rena?",
    "respuesta": "06156",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Villar de Rena"
  },
  {
    "id": "CPEI-T36-S02-3E4A3449AA",
    "orden": 3180,
    "concepto": "¿Qué población oficial tenía Villar de Rena a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.326 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Villar de Rena"
  },
  {
    "id": "CPEI-T36-S02-24B02632E4",
    "orden": 3190,
    "concepto": "¿Cuál es el código INE del municipio de Villar del Rey?",
    "respuesta": "06155",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Villar del Rey"
  },
  {
    "id": "CPEI-T36-S02-7E0E6A7357",
    "orden": 3200,
    "concepto": "¿Qué población oficial tenía Villar del Rey a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "2.064 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Villar del Rey"
  },
  {
    "id": "CPEI-T36-S02-B87742374F",
    "orden": 3210,
    "concepto": "¿Cuál es el código INE del municipio de Villarta de los Montes?",
    "respuesta": "06157",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Villarta de los Montes"
  },
  {
    "id": "CPEI-T36-S02-360C155048",
    "orden": 3220,
    "concepto": "¿Qué población oficial tenía Villarta de los Montes a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "375 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Villarta de los Montes"
  },
  {
    "id": "CPEI-T36-S02-1A1274C657",
    "orden": 3250,
    "concepto": "¿Cuál es el código INE del municipio de Zahínos?",
    "respuesta": "06159",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Zahínos"
  },
  {
    "id": "CPEI-T36-S02-43BF60CB03",
    "orden": 3260,
    "concepto": "¿Qué población oficial tenía Zahínos a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "2.766 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Zahínos"
  },
  {
    "id": "CPEI-T36-S02-E2103A00F9",
    "orden": 3270,
    "concepto": "¿Cuál es el código INE del municipio de Zalamea de la Serena?",
    "respuesta": "06160",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Zalamea de la Serena"
  },
  {
    "id": "CPEI-T36-S02-BBC4711B68",
    "orden": 3280,
    "concepto": "¿Qué población oficial tenía Zalamea de la Serena a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "3.371 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Zalamea de la Serena"
  },
  {
    "id": "CPEI-T36-S02-5B7C753ED6",
    "orden": 3290,
    "concepto": "¿Cuál es el código INE del municipio de Zarza, La?",
    "respuesta": "06162",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Zarza, La"
  },
  {
    "id": "CPEI-T36-S02-01638F3E99",
    "orden": 3300,
    "concepto": "¿Qué población oficial tenía Zarza, La a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "3.339 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Zarza, La"
  },
  {
    "id": "CPEI-T36-S02-DC02850501",
    "orden": 3310,
    "concepto": "¿Cuál es el código INE del municipio de Zarza-Capilla?",
    "respuesta": "06161",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Zarza-Capilla"
  },
  {
    "id": "CPEI-T36-S02-2FB32D32C5",
    "orden": 3320,
    "concepto": "¿Qué población oficial tenía Zarza-Capilla a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "295 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Zarza-Capilla"
  }
];
