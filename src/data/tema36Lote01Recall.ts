/** Tema 36 lote 01 recall cards — local subset (78). Do not load all 528 tema 36 cards or lotes 02–08. */

export type Tema36Lote01RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA36_LOTE01_RECALL_META = {
  tema: 36,
  lote: "lote01",
  title: "Tema 36 · Lote 01 — Núcleo de examen: marco, municipios clave, oro/hidro/embalses",
  count: 78,
  source: "tema36_fichas.json + tema36_lotes.json",
} as const;

export const TEMA36_LOTE01_RECALL_CARDS: Tema36Lote01RecallCard[] = [
  {
    "id": "CPEI-T36-S01-2A0B8D8C18",
    "orden": 10,
    "concepto": "¿Cuál es la capital de la provincia?",
    "respuesta": "Badajoz.",
    "fuente": "IGN: Nomenclátor Geográfico de Municipios y Entidades de Población",
    "localizacion": "tabla 2859 / Nomenclátor",
    "apartado": "Marco"
  },
  {
    "id": "CPEI-T36-S01-D510AB8D65",
    "orden": 20,
    "concepto": "¿Qué código provincial utiliza el INE para Badajoz?",
    "respuesta": "06.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859 / Nomenclátor",
    "apartado": "Marco"
  },
  {
    "id": "CPEI-T36-S01-419C97CE9B",
    "orden": 30,
    "concepto": "¿Qué tres tramos de población exige el epígrafe?",
    "respuesta": "Hasta 5.000 habitantes; de 5.001 a 20.000; y más de 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859 / Nomenclátor",
    "apartado": "Marco"
  },
  {
    "id": "CPEI-T36-S01-CD36AF41DD",
    "orden": 40,
    "concepto": "¿A qué fecha se refieren las cifras municipales usadas?",
    "respuesta": "1 de enero de 2025.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859 / Nomenclátor",
    "apartado": "Marco"
  },
  {
    "id": "CPEI-T36-S01-73F24B915A",
    "orden": 50,
    "concepto": "¿Qué fuente decide la denominación oficial y georreferenciada?",
    "respuesta": "El Nomenclátor Geográfico de Municipios y Entidades de Población del IGN.",
    "fuente": "IGN: Nomenclátor Geográfico de Municipios y Entidades de Población",
    "localizacion": "tabla 2859 / Nomenclátor",
    "apartado": "Marco"
  },
  {
    "id": "CPEI-T36-S02-734D640EE3",
    "orden": 80,
    "concepto": "¿Cuál es el código INE del municipio de Aceuchal?",
    "respuesta": "06002",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Aceuchal"
  },
  {
    "id": "CPEI-T36-S02-7CA46DB703",
    "orden": 90,
    "concepto": "¿Qué población oficial tenía Aceuchal a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "5.307 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Aceuchal"
  },
  {
    "id": "CPEI-T36-S02-6090DF251C",
    "orden": 260,
    "concepto": "¿Cuál es el código INE del municipio de Almendralejo?",
    "respuesta": "06011",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Almendralejo"
  },
  {
    "id": "CPEI-T36-S02-581F657A32",
    "orden": 270,
    "concepto": "¿Qué población oficial tenía Almendralejo a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "34.587 habitantes; más de 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Almendralejo"
  },
  {
    "id": "CPEI-T36-S02-B08849E3E1",
    "orden": 320,
    "concepto": "¿Cuál es el código INE del municipio de Azuaga?",
    "respuesta": "06014",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Azuaga"
  },
  {
    "id": "CPEI-T36-S02-9A0E3EB510",
    "orden": 330,
    "concepto": "¿Qué población oficial tenía Azuaga a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "7.587 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Azuaga"
  },
  {
    "id": "CPEI-T36-S02-9A8D6DB432",
    "orden": 340,
    "concepto": "¿Cuál es el código INE del municipio de Badajoz?",
    "respuesta": "06015",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Badajoz"
  },
  {
    "id": "CPEI-T36-S02-62A9FE3183",
    "orden": 350,
    "concepto": "¿Qué población oficial tenía Badajoz a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "150.209 habitantes; más de 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Badajoz"
  },
  {
    "id": "CPEI-T36-S02-64ABC67D70",
    "orden": 540,
    "concepto": "¿Cuál es el código INE del municipio de Calamonte?",
    "respuesta": "06025",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Calamonte"
  },
  {
    "id": "CPEI-T36-S02-0A4022A679",
    "orden": 550,
    "concepto": "¿Qué población oficial tenía Calamonte a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "6.104 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Calamonte"
  },
  {
    "id": "CPEI-T36-S02-7C73BF41ED",
    "orden": 760,
    "concepto": "¿Cuál es el código INE del municipio de Castuera?",
    "respuesta": "06036",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Castuera"
  },
  {
    "id": "CPEI-T36-S02-BE491A4A28",
    "orden": 770,
    "concepto": "¿Qué población oficial tenía Castuera a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "5.457 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Castuera"
  },
  {
    "id": "CPEI-T36-S02-0037BF95E9",
    "orden": 890,
    "concepto": "¿Cuál es el código INE del municipio de Don Benito?",
    "respuesta": "06044",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Don Benito"
  },
  {
    "id": "CPEI-T36-S02-69ABD4A739",
    "orden": 900,
    "concepto": "¿Qué población oficial tenía Don Benito a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "37.986 habitantes; más de 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Don Benito"
  },
  {
    "id": "CPEI-T36-S02-71A23AB595",
    "orden": 1100,
    "concepto": "¿Cuál es el código INE del municipio de Fuente del Maestre?",
    "respuesta": "06054",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Fuente del Maestre"
  },
  {
    "id": "CPEI-T36-S02-57A7367B23",
    "orden": 1110,
    "concepto": "¿Qué población oficial tenía Fuente del Maestre a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "6.499 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Fuente del Maestre"
  },
  {
    "id": "CPEI-T36-S02-F26BE13AAA",
    "orden": 1240,
    "concepto": "¿Cuál es el código INE del municipio de Guareña?",
    "respuesta": "06060",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Guareña"
  },
  {
    "id": "CPEI-T36-S02-7E72635AEF",
    "orden": 1250,
    "concepto": "¿Qué población oficial tenía Guareña a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "6.665 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Guareña"
  },
  {
    "id": "CPEI-T36-S02-C8D4A7B9F0",
    "orden": 1440,
    "concepto": "¿Cuál es el código INE del municipio de Jerez de los Caballeros?",
    "respuesta": "06070",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Jerez de los Caballeros"
  },
  {
    "id": "CPEI-T36-S02-6BF70EEBAF",
    "orden": 1450,
    "concepto": "¿Qué población oficial tenía Jerez de los Caballeros a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "9.095 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Jerez de los Caballeros"
  },
  {
    "id": "CPEI-T36-S02-A1DB66F378",
    "orden": 1500,
    "concepto": "¿Cuál es el código INE del municipio de Llerena?",
    "respuesta": "06074",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Llerena"
  },
  {
    "id": "CPEI-T36-S02-D9ABC9873D",
    "orden": 1510,
    "concepto": "¿Qué población oficial tenía Llerena a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "5.642 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Llerena"
  },
  {
    "id": "CPEI-T36-S02-7117FFA23D",
    "orden": 1770,
    "concepto": "¿Cuál es el código INE del municipio de Montijo?",
    "respuesta": "06088",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Montijo"
  },
  {
    "id": "CPEI-T36-S02-D612F4EE85",
    "orden": 1780,
    "concepto": "¿Qué población oficial tenía Montijo a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "15.198 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Montijo"
  },
  {
    "id": "CPEI-T36-S02-7F16D4007E",
    "orden": 1810,
    "concepto": "¿Cuál es el código INE del municipio de Mérida?",
    "respuesta": "06083",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Mérida"
  },
  {
    "id": "CPEI-T36-S02-078DF1C638",
    "orden": 1820,
    "concepto": "¿Qué población oficial tenía Mérida a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "60.225 habitantes; más de 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Mérida"
  },
  {
    "id": "CPEI-T36-S02-1F51847F2E",
    "orden": 1930,
    "concepto": "¿Cuál es el código INE del municipio de Olivenza?",
    "respuesta": "06095",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Olivenza"
  },
  {
    "id": "CPEI-T36-S02-3F87A8C38A",
    "orden": 1940,
    "concepto": "¿Qué población oficial tenía Olivenza a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "11.789 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Olivenza"
  },
  {
    "id": "CPEI-T36-S02-F9795C3665",
    "orden": 2130,
    "concepto": "¿Cuál es el código INE del municipio de Puebla de la Calzada?",
    "respuesta": "06103",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Puebla de la Calzada"
  },
  {
    "id": "CPEI-T36-S02-9D25CFD6DB",
    "orden": 2140,
    "concepto": "¿Qué población oficial tenía Puebla de la Calzada a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "5.815 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Puebla de la Calzada"
  },
  {
    "id": "CPEI-T36-S02-EA0FC1FD3D",
    "orden": 2430,
    "concepto": "¿Cuál es el código INE del municipio de San Vicente de Alcántara?",
    "respuesta": "06123",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "San Vicente de Alcántara"
  },
  {
    "id": "CPEI-T36-S02-38470393BC",
    "orden": 2440,
    "concepto": "¿Qué población oficial tenía San Vicente de Alcántara a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "5.227 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "San Vicente de Alcántara"
  },
  {
    "id": "CPEI-T36-S02-600F8459BF",
    "orden": 2510,
    "concepto": "¿Cuál es el código INE del municipio de Santos de Maimona, Los?",
    "respuesta": "06122",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Santos de Maimona, Los"
  },
  {
    "id": "CPEI-T36-S02-76A01461D4",
    "orden": 2520,
    "concepto": "¿Qué población oficial tenía Santos de Maimona, Los a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "8.088 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Santos de Maimona, Los"
  },
  {
    "id": "CPEI-T36-S02-AA12BB0F11",
    "orden": 2610,
    "concepto": "¿Cuál es el código INE del municipio de Talavera la Real?",
    "respuesta": "06128",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Talavera la Real"
  },
  {
    "id": "CPEI-T36-S02-94F7FAB397",
    "orden": 2620,
    "concepto": "¿Qué población oficial tenía Talavera la Real a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "5.288 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Talavera la Real"
  },
  {
    "id": "CPEI-T36-S02-DDF05262D8",
    "orden": 3050,
    "concepto": "¿Cuál es el código INE del municipio de Villafranca de los Barros?",
    "respuesta": "06149",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Villafranca de los Barros"
  },
  {
    "id": "CPEI-T36-S02-64F97644AA",
    "orden": 3060,
    "concepto": "¿Qué población oficial tenía Villafranca de los Barros a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "12.284 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Villafranca de los Barros"
  },
  {
    "id": "CPEI-T36-S02-2D925CD3DF",
    "orden": 3130,
    "concepto": "¿Cuál es el código INE del municipio de Villanueva de la Serena?",
    "respuesta": "06153",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Villanueva de la Serena"
  },
  {
    "id": "CPEI-T36-S02-BD306D06E5",
    "orden": 3140,
    "concepto": "¿Qué población oficial tenía Villanueva de la Serena a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "25.773 habitantes; más de 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Villanueva de la Serena"
  },
  {
    "id": "CPEI-T36-S02-BDC822EA2C",
    "orden": 3230,
    "concepto": "¿Cuál es el código INE del municipio de Zafra?",
    "respuesta": "06158",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, fila municipal",
    "apartado": "Zafra"
  },
  {
    "id": "CPEI-T36-S02-84598BAE23",
    "orden": 3240,
    "concepto": "¿Qué población oficial tenía Zafra a 1 de enero de 2025 y en qué tramo del temario se clasifica?",
    "respuesta": "16.735 habitantes; de 5.001 a 20.000 habitantes.",
    "fuente": "INE: población por municipios y sexo, Badajoz",
    "localizacion": "tabla 2859, columna Total 2025",
    "apartado": "Zafra"
  },
  {
    "id": "CPEI-T36-S03-887722957A",
    "orden": 3330,
    "concepto": "¿Cómo se han determinado los límites administrativos municipales del tema 36?",
    "respuesta": "Mediante las unidades de cuarto orden y relaciones au:boundary del servicio oficial IGN-CNIG. Se han generado 165 fichas, una por municipio, con límites intraprovinciales y externos.",
    "fuente": "IGN-CNIG, Límites y Unidades Administrativas Actuales",
    "localizacion": "AdministrativeUnit 4thOrder y relaciones au:boundary; versión 28/07/2026",
    "apartado": "Límites municipales"
  },
  {
    "id": "CPEI-T36-S04-CC867DE3D2",
    "orden": 3340,
    "concepto": "¿Dónde está el vértice geodésico Tentudía y qué altitud de referencia da el IGN?",
    "respuesta": "Calera de León, sobre el tejado del monasterio de Nuestra Señora de Tentudía; 1.112,446 m (base del pilar).",
    "fuente": "IGN, Red Geodésica Nacional: reseñas de vértices geodésicos (datos-geodesia.ign.es), consultadas el 31/10/2026",
    "localizacion": "vértice geodésico IGN nº 89753 Tentudía (hoja MTN50 0897): municipio Calera de León; altitud sobre el nivel medio del mar 1.112,446 m (BP)",
    "apartado": "Tentudía"
  },
  {
    "id": "CPEI-T36-S04-7210607B16",
    "orden": 3350,
    "concepto": "¿Dónde está el vértice geodésico Buitrera y qué altitud de referencia da el IGN?",
    "respuesta": "Punto más alto de la sierra de Buitrera, en Benquerencia de la Serena; 855,757 m (base del pilar).",
    "fuente": "IGN, Red Geodésica Nacional: reseñas de vértices geodésicos (datos-geodesia.ign.es), consultadas el 31/10/2026",
    "localizacion": "vértice geodésico IGN nº 80621 Buitrera (hoja MTN50 0806): municipio Benquerencia de la Serena; altitud sobre el nivel medio del mar 855,757 m (BP)",
    "apartado": "Pico de la Buitrera"
  },
  {
    "id": "CPEI-T36-S04-8917348693",
    "orden": 3360,
    "concepto": "¿Dónde está el vértice geodésico San Cristóbal y qué altitud de referencia da el IGN?",
    "respuesta": "Cumbre del cerro San Cristóbal (sierra del Dómine), unos 2,5 km al N de Higuera la Real; 773,533 m (base del pilar).",
    "fuente": "IGN, Red Geodésica Nacional: reseñas de vértices geodésicos (datos-geodesia.ign.es), consultadas el 31/10/2026",
    "localizacion": "vértice geodésico IGN nº 89650 San Cristóbal (hoja MTN50 0896): municipio Higuera la Real; altitud sobre el nivel medio del mar 773,533 m (BP)",
    "apartado": "Cerro de San Cristóbal"
  },
  {
    "id": "CPEI-T36-S04-BFD6A68289",
    "orden": 3370,
    "concepto": "¿Dónde está el vértice geodésico Peña Utrera y qué altitud de referencia da el IGN?",
    "respuesta": "Peñón de Peña Utrera, unos 1.300 m al O del castillo de Salvatierra de los Barros; 814,604 m (base del pilar).",
    "fuente": "IGN, Red Geodésica Nacional: reseñas de vértices geodésicos (datos-geodesia.ign.es), consultadas el 31/10/2026",
    "localizacion": "vértice geodésico IGN nº 85349 Peña Utrera (hoja MTN50 0853): municipio Salvatierra de los Barros; altitud sobre el nivel medio del mar 814,604 m (BP)",
    "apartado": "Peña Utrera"
  },
  {
    "id": "CPEI-T36-S04-51C8483765",
    "orden": 3380,
    "concepto": "¿Qué es la Sierra del Puerto del Centinela y en qué municipio está?",
    "respuesta": "una alineación montañosa; está en el término municipal de Alburquerque.",
    "fuente": "IGN, Nomenclátor Geográfico Básico de España (NGBE), consultado con el geocodificador de CartoCiudad",
    "localizacion": "NGBE ngbe_465735 «Sierra del Puerto del Centinela» (Alineación montañosa), 39,2145 N / 6,9953 O, municipio Alburquerque; el NGBE no da cota y no se indica altitud",
    "apartado": "Sierra del Puerto del Centinela"
  },
  {
    "id": "CPEI-T36-S05-7B8FA3BC15",
    "orden": 3390,
    "concepto": "¿A qué cuenca pertenece el Guadiana y por dónde pasa en Badajoz?",
    "respuesta": "cuenca del Guadiana; es el río principal de la cuenca; pasa por Mérida y por Badajoz, donde recibe al Gévora.",
    "fuente": "MITECO, Ríos completos clasificados según Pfafstetter modificado (capa agua:rios_comp_pfaf, escala 1:25.000, act. 13/03/2018); municipios por las coordenadas del nacimiento y la desembocadura sobre las unidades administrativas del IGN",
    "localizacion": "río 1008 RIO GUADIANA: cauce en los términos de Mérida (06083) y Badajoz (06015); confluencia del Gévora (100834) en Badajoz",
    "apartado": "Guadiana"
  },
  {
    "id": "CPEI-T36-S05-BAAF017EE4",
    "orden": 3400,
    "concepto": "¿A qué cuenca pertenece el Zújar y cuál es su recorrido en Badajoz?",
    "respuesta": "cuenca del Guadiana; nace en el límite entre Fuente Obejuna (Córdoba) y Granja de Torrehermosa y desemboca en el Guadiana en Villanueva de la Serena.",
    "fuente": "MITECO, Ríos completos clasificados según Pfafstetter modificado (capa agua:rios_comp_pfaf, escala 1:25.000, act. 13/03/2018); municipios por las coordenadas del nacimiento y la desembocadura sobre las unidades administrativas del IGN",
    "localizacion": "río 10084 RIO ZUJAR (211,1 km): nacimiento en el límite Fuente Obejuna (14029) / Granja de Torrehermosa (06059); desembocadura en el Guadiana en Villanueva de la Serena (06153)",
    "apartado": "Zújar"
  },
  {
    "id": "CPEI-T36-S05-99FA6D1593",
    "orden": 3410,
    "concepto": "¿A qué cuenca pertenece el Matachel y cuál es su recorrido en Badajoz?",
    "respuesta": "cuenca del Guadiana; nace en Azuaga y desemboca en el Guadiana en el límite entre Don Álvaro y La Zarza.",
    "fuente": "MITECO, Ríos completos clasificados según Pfafstetter modificado (capa agua:rios_comp_pfaf, escala 1:25.000, act. 13/03/2018); municipios por las coordenadas del nacimiento y la desembocadura sobre las unidades administrativas del IGN",
    "localizacion": "río 100836 RIO MATACHEL (129,3 km): nacimiento en Azuaga (06014); desembocadura en el Guadiana en el límite Don Álvaro (06043) / La Zarza (06162)",
    "apartado": "Matachel"
  },
  {
    "id": "CPEI-T36-S05-5907106D74",
    "orden": 3420,
    "concepto": "¿A qué cuenca pertenece el Gévora y cuál es su recorrido en Badajoz?",
    "respuesta": "cuenca del Guadiana; su cauce en la red española empieza en La Codosera y desemboca en el Guadiana en Badajoz.",
    "fuente": "MITECO, Ríos completos clasificados según Pfafstetter modificado (capa agua:rios_comp_pfaf, escala 1:25.000, act. 13/03/2018); municipios por las coordenadas del nacimiento y la desembocadura sobre las unidades administrativas del IGN",
    "localizacion": "río 100834 RIO GEVORA (51,3 km en la red española): primer punto en La Codosera (06037); desembocadura en el Guadiana en Badajoz (06015)",
    "apartado": "Gévora"
  },
  {
    "id": "CPEI-T36-S05-1E8DFEE86D",
    "orden": 3430,
    "concepto": "¿A qué cuenca pertenece el Guadámez y cuál es su recorrido en Badajoz?",
    "respuesta": "cuenca del Guadiana; nace en Valencia de las Torres y desemboca en el Guadiana en Guareña.",
    "fuente": "MITECO, Ríos completos clasificados según Pfafstetter modificado (capa agua:rios_comp_pfaf, escala 1:25.000, act. 13/03/2018); municipios por las coordenadas del nacimiento y la desembocadura sobre las unidades administrativas del IGN",
    "localizacion": "río 1008374 RIO GUADAMEZ (93,9 km): nacimiento en Valencia de las Torres (06139); desembocadura en el Guadiana en Guareña (06060)",
    "apartado": "Guadámez"
  },
  {
    "id": "CPEI-T36-S05-845FA7851C",
    "orden": 3440,
    "concepto": "¿A qué cuenca pertenece el Ardila y cuál es su recorrido en Badajoz?",
    "respuesta": "cuenca del Guadiana; afluente del Guadiana; nace en Cabeza la Vaca y su tramo en la red española acaba en Valencia del Mombuey.",
    "fuente": "MITECO, Ríos completos clasificados según Pfafstetter modificado (capa agua:rios_comp_pfaf, escala 1:25.000, act. 13/03/2018); municipios por las coordenadas del nacimiento y la desembocadura sobre las unidades administrativas del IGN",
    "localizacion": "río 10082 RIO ARDILA (115,9 km en la red española): nacimiento en Cabeza la Vaca (06024); último punto en Valencia del Mombuey (06140); código Pfafstetter de afluente directo del Guadiana (1008)",
    "apartado": "Ardila"
  },
  {
    "id": "CPEI-T36-S05-B5B0FB6E5E",
    "orden": 3450,
    "concepto": "¿A qué cuenca pertenece el Alcarrache y cuál es su recorrido en Badajoz?",
    "respuesta": "cuenca del Guadiana; afluente del Guadiana; nace en Jerez de los Caballeros y su tramo en la red española acaba en Villanueva del Fresno.",
    "fuente": "MITECO, Ríos completos clasificados según Pfafstetter modificado (capa agua:rios_comp_pfaf, escala 1:25.000, act. 13/03/2018); municipios por las coordenadas del nacimiento y la desembocadura sobre las unidades administrativas del IGN",
    "localizacion": "río 1008332 RIO ALCARRACHE (73,0 km en la red española): nacimiento en Jerez de los Caballeros (06070); último punto en Villanueva del Fresno (06154); código Pfafstetter de afluente directo del Guadiana (1008)",
    "apartado": "Alcarrache"
  },
  {
    "id": "CPEI-T36-S05-804BF77282",
    "orden": 3460,
    "concepto": "¿A qué cuenca pertenece el Bodión y cuál es su recorrido en Badajoz?",
    "respuesta": "cuenca del Guadiana; afluente del Ardila; nace en Monesterio y desemboca en el Ardila en el límite entre Burguillos del Cerro y Fregenal de la Sierra.",
    "fuente": "MITECO, Ríos completos clasificados según Pfafstetter modificado (capa agua:rios_comp_pfaf, escala 1:25.000, act. 13/03/2018); municipios por las coordenadas del nacimiento y la desembocadura sobre las unidades administrativas del IGN",
    "localizacion": "río 100828 RIO BODION (62,7 km): nacimiento en Monesterio (06085); desembocadura en el Ardila (10082) en el límite Burguillos del Cerro (06022) / Fregenal de la Sierra (06050)",
    "apartado": "Bodión"
  },
  {
    "id": "CPEI-T36-S05-BF1DFE6130",
    "orden": 3470,
    "concepto": "¿A qué cuenca pertenece el Ortiga y cuál es su recorrido en Badajoz?",
    "respuesta": "cuenca del Guadiana; nace en Zalamea de la Serena y desemboca en el Guadiana en Medellín.",
    "fuente": "MITECO, Ríos completos clasificados según Pfafstetter modificado (capa agua:rios_comp_pfaf, escala 1:25.000, act. 13/03/2018); municipios por las coordenadas del nacimiento y la desembocadura sobre las unidades administrativas del IGN",
    "localizacion": "río 1008378 RIO ORTIGA (60,8 km): nacimiento en Zalamea de la Serena (06160); desembocadura en el Guadiana en Medellín (06080)",
    "apartado": "Ortiga"
  },
  {
    "id": "CPEI-T36-S06-782DE8B9C6",
    "orden": 3480,
    "concepto": "¿Dónde se localiza La Serena?",
    "respuesta": "río Zújar; presa en el término de Castuera.",
    "fuente": "CEDEX, Anuario de Aforos 2021-2022, embalses de la C.H. Guadiana (ceh.cedex.es)",
    "localizacion": "embalse 4010 LA SERENA: corriente río Zújar; municipio Castuera",
    "apartado": "La Serena"
  },
  {
    "id": "CPEI-T36-S06-92E86A0B31",
    "orden": 3490,
    "concepto": "¿Dónde se localiza Zújar?",
    "respuesta": "río Zújar; entorno de Castuera/Esparragosa de Lares.",
    "fuente": "CEDEX, Anuario de Aforos 2021-2022, embalses de la C.H. Guadiana (ceh.cedex.es)",
    "localizacion": "embalse 4006 ZÚJAR: corriente río Zújar; municipio Esparragosa de Lares",
    "apartado": "Zújar"
  },
  {
    "id": "CPEI-T36-S06-203D362D2B",
    "orden": 3500,
    "concepto": "¿Dónde se localiza Orellana?",
    "respuesta": "río Guadiana; Vegas Altas–Orellana.",
    "fuente": "CEDEX, Anuario de Aforos 2021-2022, embalses de la C.H. Guadiana (ceh.cedex.es)",
    "localizacion": "embalse 4004 ORELLANA: corriente río Guadiana; municipio Orellana la Vieja",
    "apartado": "Orellana"
  },
  {
    "id": "CPEI-T36-S06-3390F3AC52",
    "orden": 3510,
    "concepto": "¿Dónde se localiza Cíjara?",
    "respuesta": "río Guadiana; la presa está en Alía (Cáceres), no en la provincia de Badajoz.",
    "fuente": "CEDEX, Anuario de Aforos 2021-2022, embalses de la C.H. Guadiana (ceh.cedex.es)",
    "localizacion": "embalse 4002 CIJARA: corriente río Guadiana; municipio Alía (Cáceres)",
    "apartado": "Cíjara"
  },
  {
    "id": "CPEI-T36-S06-1602493A86",
    "orden": 3520,
    "concepto": "¿Dónde se localiza García de Sola / Puerto Peña?",
    "respuesta": "río Guadiana; Talarrubias–Herrera del Duque.",
    "fuente": "CEDEX, Anuario de Aforos 2021-2022, embalses de la C.H. Guadiana (ceh.cedex.es)",
    "localizacion": "embalse 4003 GARCÍA DE SOLA: corriente río Guadiana; municipio Talarrubias; hoja 756 (Herrera del Duque)",
    "apartado": "García de Sola / Puerto Peña"
  },
  {
    "id": "CPEI-T36-S06-A1DD263767",
    "orden": 3530,
    "concepto": "¿Dónde se localiza Alange?",
    "respuesta": "río Matachel; Alange.",
    "fuente": "CEDEX, Anuario de Aforos 2021-2022, embalses de la C.H. Guadiana (ceh.cedex.es)",
    "localizacion": "embalse 4011 ALANGE: corriente río Matachel; municipio Alange",
    "apartado": "Alange"
  },
  {
    "id": "CPEI-T36-S06-1635983041",
    "orden": 3540,
    "concepto": "¿Dónde se localiza Los Molinos?",
    "respuesta": "río Matachel; presa en el término de Hornachos.",
    "fuente": "CEDEX, Anuario de Aforos 2021-2022, embalses de la C.H. Guadiana (ceh.cedex.es)",
    "localizacion": "embalse 4017 LOS MOLINOS DE MATACHEL: corriente río Matachel; municipio Hornachos",
    "apartado": "Los Molinos"
  },
  {
    "id": "CPEI-T36-S06-AE1F66E806",
    "orden": 3550,
    "concepto": "¿Dónde se localiza Montijo?",
    "respuesta": "río Guadiana; presa en el término de Mérida.",
    "fuente": "CEDEX, Anuario de Aforos 2021-2022, embalses de la C.H. Guadiana (ceh.cedex.es)",
    "localizacion": "embalse 4016 MONTIJO: corriente río Guadiana; municipio Mérida",
    "apartado": "Montijo"
  },
  {
    "id": "CPEI-T36-S06-38F90AE742",
    "orden": 3560,
    "concepto": "¿Dónde se localiza Villar del Rey / Peña del Águila?",
    "respuesta": "río Zapatón; Villar del Rey.",
    "fuente": "CEDEX, Anuario de Aforos 2021-2022, embalses de la C.H. Guadiana (ceh.cedex.es)",
    "localizacion": "embalse 4015 VILLAR DEL REY: corriente río Zapatón; municipio Villar del Rey",
    "apartado": "Villar del Rey / Peña del Águila"
  },
  {
    "id": "CPEI-T36-S06-3FD7762AAD",
    "orden": 3570,
    "concepto": "¿Dónde se localiza Tentudía?",
    "respuesta": "río Bodión; presa en el término de Calera de León.",
    "fuente": "CEDEX, Anuario de Aforos 2021-2022, embalses de la C.H. Guadiana (ceh.cedex.es)",
    "localizacion": "embalse 4020 TENTUDÍA: corriente río Bodión; municipio Calera de León",
    "apartado": "Tentudía"
  },
  {
    "id": "CPEI-T36-S06-56C44E4A50",
    "orden": 3580,
    "concepto": "¿Sobre qué río está la presa de Piedra Aguda y dónde?",
    "respuesta": "río Olivenza; la presa está en el límite entre Olivenza y Valverde de Leganés.",
    "fuente": "MITECO, Inventario de Presas y Embalses (shapefiles egis_presa/egis_embalse, abril de 2025); municipio por las coordenadas de la presa sobre los límites municipales del IGN (unidades administrativas)",
    "localizacion": "presa 4060031 PIEDRA AGUDA (embalse 1703): cauce río Olivenza; coordenadas en el límite municipal Olivenza / Valverde de Leganés",
    "apartado": "Piedra Aguda"
  },
  {
    "id": "CPEI-T36-S06-0EBFECFFE3",
    "orden": 3590,
    "concepto": "¿Sobre qué río está la presa de Valuengo y en qué municipio?",
    "respuesta": "río Ardila; Jerez de los Caballeros.",
    "fuente": "MITECO, Inventario de Presas y Embalses (shapefiles egis_presa/egis_embalse, abril de 2025); municipio por las coordenadas de la presa sobre los límites municipales del IGN (unidades administrativas)",
    "localizacion": "presa 4060067 VALUENGO (embalse 2435): cauce río Ardila; municipio Jerez de los Caballeros",
    "apartado": "Valuengo"
  },
  {
    "id": "CPEI-T36-S06-4961D87A48",
    "orden": 3600,
    "concepto": "¿Dónde se localiza Cornalvo?",
    "respuesta": "arroyo Albarregas; presa en el término de Mérida (parque natural de Cornalvo).",
    "fuente": "CEDEX, Anuario de Aforos 2021-2022, embalses de la C.H. Guadiana (ceh.cedex.es)",
    "localizacion": "embalse 4013 CORNALBO: corriente arroyo Albarregas; municipio Mérida",
    "apartado": "Cornalvo"
  },
  {
    "id": "CPEI-T36-S06-79C9784D7C",
    "orden": 3610,
    "concepto": "¿Dónde se localiza Proserpina?",
    "respuesta": "río Pardillas; presa en el término de Mérida.",
    "fuente": "CEDEX, Anuario de Aforos 2021-2022, embalses de la C.H. Guadiana (ceh.cedex.es)",
    "localizacion": "embalse 4014 PROSERPINA: corriente río Pardillas; municipio Mérida",
    "apartado": "Proserpina"
  },
  {
    "id": "CPEI-T36-S06-290EA56D14",
    "orden": 3620,
    "concepto": "¿Dónde se localiza Laguna de La Albuera?",
    "respuesta": "complejo lagunar de La Albuera.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "SIN VERIFICAR (sin artículo ni página): hidrografía y cartografía oficial",
    "apartado": "Laguna de La Albuera"
  },
  {
    "id": "CPEI-T36-S06-CAAF86E55A",
    "orden": 3630,
    "concepto": "¿Sobre qué cauce está la presa de Brovales y en qué municipio?",
    "respuesta": "arroyo de Brovales; Jerez de los Caballeros.",
    "fuente": "MITECO, Inventario de Presas y Embalses (shapefiles egis_presa/egis_embalse, abril de 2025); municipio por las coordenadas de la presa sobre los límites municipales del IGN (unidades administrativas)",
    "localizacion": "presa 4060047 BROVALES (embalse 382): cauce arroyo de Brovales; municipio Jerez de los Caballeros",
    "apartado": "Embalse de Brovales"
  }
];
