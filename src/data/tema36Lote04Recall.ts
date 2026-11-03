/** Tema 36 lote 04 recall cards — local subset (78). Self-contained: do not load all 528 tema 36 cards nor the other lotes (lote 01, lote 02, lote 03, lote 05, lote 06, lote 07, lote 08). */

export type Tema36Lote04RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA36_LOTE04_RECALL_META = {
  tema: 36,
  lote: "lote04",
  title: "Tema 36 · Lote 04 — Municipios restantes (INE + población ≤5.000): Oliva de Mérida → Táliga",
  count: 78,
  source: "tema36_fichas.json + tema36_lotes.json",
} as const;

export const TEMA36_LOTE04_RECALL_CARDS: Tema36Lote04RecallCard[] = [
  {
    "id": "CPEI-T36-S02-68594D9C71",
    "orden": 1890,
    "concepto": "¿Cuál es el código INE del municipio de Oliva de Mérida?",
    "respuesta": "06094",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Oliva de Mérida"
  },
  {
    "id": "CPEI-T36-S02-741C21B9C0",
    "orden": 1900,
    "concepto": "¿Qué población oficial tenía Oliva de Mérida a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.660 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Oliva de Mérida"
  },
  {
    "id": "CPEI-T36-S02-7B309950F7",
    "orden": 1910,
    "concepto": "¿Cuál es el código INE del municipio de Oliva de la Frontera?",
    "respuesta": "06093",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Oliva de la Frontera"
  },
  {
    "id": "CPEI-T36-S02-7FE88FA478",
    "orden": 1920,
    "concepto": "¿Qué población oficial tenía Oliva de la Frontera a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "4.907 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Oliva de la Frontera"
  },
  {
    "id": "CPEI-T36-S02-454F413966",
    "orden": 1950,
    "concepto": "¿Cuál es el código INE del municipio de Orellana de la Sierra?",
    "respuesta": "06096",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Orellana de la Sierra"
  },
  {
    "id": "CPEI-T36-S02-B6B3240EDB",
    "orden": 1960,
    "concepto": "¿Qué población oficial tenía Orellana de la Sierra a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "250 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Orellana de la Sierra"
  },
  {
    "id": "CPEI-T36-S02-819AB5AE16",
    "orden": 1970,
    "concepto": "¿Cuál es el código INE del municipio de Orellana la Vieja?",
    "respuesta": "06097",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Orellana la Vieja"
  },
  {
    "id": "CPEI-T36-S02-E6F0BE00B1",
    "orden": 1980,
    "concepto": "¿Qué población oficial tenía Orellana la Vieja a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "2.580 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Orellana la Vieja"
  },
  {
    "id": "CPEI-T36-S02-1705CD96BA",
    "orden": 1990,
    "concepto": "¿Cuál es el código INE del municipio de Palomas?",
    "respuesta": "06098",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Palomas"
  },
  {
    "id": "CPEI-T36-S02-338039C30E",
    "orden": 2000,
    "concepto": "¿Qué población oficial tenía Palomas a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "651 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Palomas"
  },
  {
    "id": "CPEI-T36-S02-497D42CF42",
    "orden": 2010,
    "concepto": "¿Cuál es el código INE del municipio de Parra, La?",
    "respuesta": "06099",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Parra, La"
  },
  {
    "id": "CPEI-T36-S02-20438F3595",
    "orden": 2020,
    "concepto": "¿Qué población oficial tenía Parra, La a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.297 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Parra, La"
  },
  {
    "id": "CPEI-T36-S02-7E911F7387",
    "orden": 2030,
    "concepto": "¿Cuál es el código INE del municipio de Peraleda del Zaucejo?",
    "respuesta": "06101",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Peraleda del Zaucejo"
  },
  {
    "id": "CPEI-T36-S02-340BAB3F28",
    "orden": 2040,
    "concepto": "¿Qué población oficial tenía Peraleda del Zaucejo a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "465 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Peraleda del Zaucejo"
  },
  {
    "id": "CPEI-T36-S02-DEBDA1EBDE",
    "orden": 2050,
    "concepto": "¿Cuál es el código INE del municipio de Peñalsordo?",
    "respuesta": "06100",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Peñalsordo"
  },
  {
    "id": "CPEI-T36-S02-9AF377FA80",
    "orden": 2060,
    "concepto": "¿Qué población oficial tenía Peñalsordo a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "805 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Peñalsordo"
  },
  {
    "id": "CPEI-T36-S02-F9498B3DD7",
    "orden": 2070,
    "concepto": "¿Cuál es el código INE del municipio de Puebla de Alcocer?",
    "respuesta": "06102",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Puebla de Alcocer"
  },
  {
    "id": "CPEI-T36-S02-61D986D93E",
    "orden": 2080,
    "concepto": "¿Qué población oficial tenía Puebla de Alcocer a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.091 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Puebla de Alcocer"
  },
  {
    "id": "CPEI-T36-S02-B6F5F8BF84",
    "orden": 2090,
    "concepto": "¿Cuál es el código INE del municipio de Puebla de Obando?",
    "respuesta": "06107",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Puebla de Obando"
  },
  {
    "id": "CPEI-T36-S02-745FDE4C74",
    "orden": 2100,
    "concepto": "¿Qué población oficial tenía Puebla de Obando a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.809 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Puebla de Obando"
  },
  {
    "id": "CPEI-T36-S02-5B3DAE11C1",
    "orden": 2110,
    "concepto": "¿Cuál es el código INE del municipio de Puebla de Sancho Pérez?",
    "respuesta": "06108",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Puebla de Sancho Pérez"
  },
  {
    "id": "CPEI-T36-S02-4F13A05B3E",
    "orden": 2120,
    "concepto": "¿Qué población oficial tenía Puebla de Sancho Pérez a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "2.634 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Puebla de Sancho Pérez"
  },
  {
    "id": "CPEI-T36-S02-CC387247B5",
    "orden": 2150,
    "concepto": "¿Cuál es el código INE del municipio de Puebla de la Reina?",
    "respuesta": "06104",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Puebla de la Reina"
  },
  {
    "id": "CPEI-T36-S02-C3777DB02F",
    "orden": 2160,
    "concepto": "¿Qué población oficial tenía Puebla de la Reina a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "689 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Puebla de la Reina"
  },
  {
    "id": "CPEI-T36-S02-13F2719D89",
    "orden": 2170,
    "concepto": "¿Cuál es el código INE del municipio de Puebla del Maestre?",
    "respuesta": "06105",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Puebla del Maestre"
  },
  {
    "id": "CPEI-T36-S02-5F6DCB4B85",
    "orden": 2180,
    "concepto": "¿Qué población oficial tenía Puebla del Maestre a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "653 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Puebla del Maestre"
  },
  {
    "id": "CPEI-T36-S02-1D033A083D",
    "orden": 2190,
    "concepto": "¿Cuál es el código INE del municipio de Puebla del Prior?",
    "respuesta": "06106",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Puebla del Prior"
  },
  {
    "id": "CPEI-T36-S02-0CD1C32580",
    "orden": 2200,
    "concepto": "¿Qué población oficial tenía Puebla del Prior a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "462 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Puebla del Prior"
  },
  {
    "id": "CPEI-T36-S02-0D9FBFC4CC",
    "orden": 2210,
    "concepto": "¿Cuál es el código INE del municipio de Pueblonuevo del Guadiana?",
    "respuesta": "06902",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Pueblonuevo del Guadiana"
  },
  {
    "id": "CPEI-T36-S02-672E524AD4",
    "orden": 2220,
    "concepto": "¿Qué población oficial tenía Pueblonuevo del Guadiana a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.955 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Pueblonuevo del Guadiana"
  },
  {
    "id": "CPEI-T36-S02-15E7EBB5ED",
    "orden": 2230,
    "concepto": "¿Cuál es el código INE del municipio de Quintana de la Serena?",
    "respuesta": "06109",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Quintana de la Serena"
  },
  {
    "id": "CPEI-T36-S02-DF852CFC2D",
    "orden": 2240,
    "concepto": "¿Qué población oficial tenía Quintana de la Serena a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "4.429 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Quintana de la Serena"
  },
  {
    "id": "CPEI-T36-S02-AC67C1AB49",
    "orden": 2250,
    "concepto": "¿Cuál es el código INE del municipio de Reina?",
    "respuesta": "06110",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Reina"
  },
  {
    "id": "CPEI-T36-S02-5B0EF07CDB",
    "orden": 2260,
    "concepto": "¿Qué población oficial tenía Reina a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "144 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Reina"
  },
  {
    "id": "CPEI-T36-S02-B32938D651",
    "orden": 2270,
    "concepto": "¿Cuál es el código INE del municipio de Rena?",
    "respuesta": "06111",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Rena"
  },
  {
    "id": "CPEI-T36-S02-F05E3A771E",
    "orden": 2280,
    "concepto": "¿Qué población oficial tenía Rena a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "605 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Rena"
  },
  {
    "id": "CPEI-T36-S02-6BE1B6C7AD",
    "orden": 2290,
    "concepto": "¿Cuál es el código INE del municipio de Retamal de Llerena?",
    "respuesta": "06112",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Retamal de Llerena"
  },
  {
    "id": "CPEI-T36-S02-D9FABCB0C7",
    "orden": 2300,
    "concepto": "¿Qué población oficial tenía Retamal de Llerena a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "428 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Retamal de Llerena"
  },
  {
    "id": "CPEI-T36-S02-DCDC8B830F",
    "orden": 2310,
    "concepto": "¿Cuál es el código INE del municipio de Ribera del Fresno?",
    "respuesta": "06113",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Ribera del Fresno"
  },
  {
    "id": "CPEI-T36-S02-D21164653B",
    "orden": 2320,
    "concepto": "¿Qué población oficial tenía Ribera del Fresno a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "3.130 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Ribera del Fresno"
  },
  {
    "id": "CPEI-T36-S02-D18608407E",
    "orden": 2330,
    "concepto": "¿Cuál es el código INE del municipio de Risco?",
    "respuesta": "06114",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Risco"
  },
  {
    "id": "CPEI-T36-S02-2451CA1F72",
    "orden": 2340,
    "concepto": "¿Qué población oficial tenía Risco a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "126 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Risco"
  },
  {
    "id": "CPEI-T36-S02-5BED43B4D2",
    "orden": 2350,
    "concepto": "¿Cuál es el código INE del municipio de Roca de la Sierra, La?",
    "respuesta": "06115",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Roca de la Sierra, La"
  },
  {
    "id": "CPEI-T36-S02-2F91A957D5",
    "orden": 2360,
    "concepto": "¿Qué población oficial tenía Roca de la Sierra, La a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.454 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Roca de la Sierra, La"
  },
  {
    "id": "CPEI-T36-S02-180AB52F1F",
    "orden": 2370,
    "concepto": "¿Cuál es el código INE del municipio de Salvaleón?",
    "respuesta": "06116",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Salvaleón"
  },
  {
    "id": "CPEI-T36-S02-788172F273",
    "orden": 2380,
    "concepto": "¿Qué población oficial tenía Salvaleón a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.645 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Salvaleón"
  },
  {
    "id": "CPEI-T36-S02-1D18F1A3D8",
    "orden": 2390,
    "concepto": "¿Cuál es el código INE del municipio de Salvatierra de los Barros?",
    "respuesta": "06117",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Salvatierra de los Barros"
  },
  {
    "id": "CPEI-T36-S02-19A6690ADC",
    "orden": 2400,
    "concepto": "¿Qué población oficial tenía Salvatierra de los Barros a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.546 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Salvatierra de los Barros"
  },
  {
    "id": "CPEI-T36-S02-D579593253",
    "orden": 2410,
    "concepto": "¿Cuál es el código INE del municipio de San Pedro de Mérida?",
    "respuesta": "06119",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "San Pedro de Mérida"
  },
  {
    "id": "CPEI-T36-S02-D63376F5A9",
    "orden": 2420,
    "concepto": "¿Qué población oficial tenía San Pedro de Mérida a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "859 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "San Pedro de Mérida"
  },
  {
    "id": "CPEI-T36-S02-25E8FB1A99",
    "orden": 2450,
    "concepto": "¿Cuál es el código INE del municipio de Sancti-Spíritus?",
    "respuesta": "06118",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Sancti-Spíritus"
  },
  {
    "id": "CPEI-T36-S02-9A7405F78E",
    "orden": 2460,
    "concepto": "¿Qué población oficial tenía Sancti-Spíritus a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "141 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Sancti-Spíritus"
  },
  {
    "id": "CPEI-T36-S02-0EB8A33AE9",
    "orden": 2470,
    "concepto": "¿Cuál es el código INE del municipio de Santa Amalia?",
    "respuesta": "06120",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Santa Amalia"
  },
  {
    "id": "CPEI-T36-S02-D6E6E8D2F7",
    "orden": 2480,
    "concepto": "¿Qué población oficial tenía Santa Amalia a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "3.881 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Santa Amalia"
  },
  {
    "id": "CPEI-T36-S02-4C1079B1F4",
    "orden": 2490,
    "concepto": "¿Cuál es el código INE del municipio de Santa Marta?",
    "respuesta": "06121",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Santa Marta"
  },
  {
    "id": "CPEI-T36-S02-4C4904293D",
    "orden": 2500,
    "concepto": "¿Qué población oficial tenía Santa Marta a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "4.201 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Santa Marta"
  },
  {
    "id": "CPEI-T36-S02-A1840AF79C",
    "orden": 2530,
    "concepto": "¿Cuál es el código INE del municipio de Segura de León?",
    "respuesta": "06124",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Segura de León"
  },
  {
    "id": "CPEI-T36-S02-E4B854B9C3",
    "orden": 2540,
    "concepto": "¿Qué población oficial tenía Segura de León a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.758 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Segura de León"
  },
  {
    "id": "CPEI-T36-S02-407F06E0D5",
    "orden": 2550,
    "concepto": "¿Cuál es el código INE del municipio de Siruela?",
    "respuesta": "06125",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Siruela"
  },
  {
    "id": "CPEI-T36-S02-294E64B56A",
    "orden": 2560,
    "concepto": "¿Qué población oficial tenía Siruela a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.766 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Siruela"
  },
  {
    "id": "CPEI-T36-S02-C6858A4C8C",
    "orden": 2570,
    "concepto": "¿Cuál es el código INE del municipio de Solana de los Barros?",
    "respuesta": "06126",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Solana de los Barros"
  },
  {
    "id": "CPEI-T36-S02-12CA67EEFD",
    "orden": 2580,
    "concepto": "¿Qué población oficial tenía Solana de los Barros a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "2.522 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Solana de los Barros"
  },
  {
    "id": "CPEI-T36-S02-934476D791",
    "orden": 2590,
    "concepto": "¿Cuál es el código INE del municipio de Talarrubias?",
    "respuesta": "06127",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Talarrubias"
  },
  {
    "id": "CPEI-T36-S02-797796428E",
    "orden": 2600,
    "concepto": "¿Qué población oficial tenía Talarrubias a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "3.251 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Talarrubias"
  },
  {
    "id": "CPEI-T36-S02-A479E3335D",
    "orden": 2630,
    "concepto": "¿Cuál es el código INE del municipio de Tamurejo?",
    "respuesta": "06130",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Tamurejo"
  },
  {
    "id": "CPEI-T36-S02-47BB33DB22",
    "orden": 2640,
    "concepto": "¿Qué población oficial tenía Tamurejo a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "190 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Tamurejo"
  },
  {
    "id": "CPEI-T36-S02-B3A6094A1F",
    "orden": 2650,
    "concepto": "¿Cuál es el código INE del municipio de Torre de Miguel Sesmero?",
    "respuesta": "06131",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Torre de Miguel Sesmero"
  },
  {
    "id": "CPEI-T36-S02-CB46430E3E",
    "orden": 2660,
    "concepto": "¿Qué población oficial tenía Torre de Miguel Sesmero a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.234 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Torre de Miguel Sesmero"
  },
  {
    "id": "CPEI-T36-S02-FA188DCAD1",
    "orden": 2670,
    "concepto": "¿Cuál es el código INE del municipio de Torremayor?",
    "respuesta": "06132",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Torremayor"
  },
  {
    "id": "CPEI-T36-S02-F872F0FF82",
    "orden": 2680,
    "concepto": "¿Qué población oficial tenía Torremayor a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "992 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Torremayor"
  },
  {
    "id": "CPEI-T36-S02-69F0CEC0EF",
    "orden": 2690,
    "concepto": "¿Cuál es el código INE del municipio de Torremejía?",
    "respuesta": "06133",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Torremejía"
  },
  {
    "id": "CPEI-T36-S02-75CFBD7A36",
    "orden": 2700,
    "concepto": "¿Qué población oficial tenía Torremejía a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "2.238 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Torremejía"
  },
  {
    "id": "CPEI-T36-S02-6568268B31",
    "orden": 2710,
    "concepto": "¿Cuál es el código INE del municipio de Trasierra?",
    "respuesta": "06134",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Trasierra"
  },
  {
    "id": "CPEI-T36-S02-1CD7DA8069",
    "orden": 2720,
    "concepto": "¿Qué población oficial tenía Trasierra a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "590 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Trasierra"
  },
  {
    "id": "CPEI-T36-S02-F97FB7EA97",
    "orden": 2730,
    "concepto": "¿Cuál es el código INE del municipio de Trujillanos?",
    "respuesta": "06135",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Trujillanos"
  },
  {
    "id": "CPEI-T36-S02-6ABA67A154",
    "orden": 2740,
    "concepto": "¿Qué población oficial tenía Trujillanos a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "1.397 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Trujillanos"
  },
  {
    "id": "CPEI-T36-S02-4A6F512A3C",
    "orden": 2750,
    "concepto": "¿Cuál es el código INE del municipio de Táliga?",
    "respuesta": "06129",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Táliga"
  },
  {
    "id": "CPEI-T36-S02-0C87B23FD1",
    "orden": 2760,
    "concepto": "¿Qué población oficial tenía Táliga a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "650 habitantes; hasta 5.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Táliga"
  }
];
