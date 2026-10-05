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
    "concepto": "¿Dónde se ubica Tentudía y qué altitud de referencia tiene?",
    "respuesta": "Sierra de Tentudía, Calera de León; 1.104 m.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "MDT/toponimia oficial; verificar cota puntual",
    "apartado": "Tentudía"
  },
  {
    "id": "CPEI-T36-S04-7210607B16",
    "orden": 3350,
    "concepto": "¿Dónde se ubica Pico de la Buitrera y qué altitud de referencia tiene?",
    "respuesta": "Sierra de la Buitrera, sector de Puebla de Alcocer; 1.021 m.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "MDT/toponimia oficial; verificar cota puntual",
    "apartado": "Pico de la Buitrera"
  },
  {
    "id": "CPEI-T36-S04-8917348693",
    "orden": 3360,
    "concepto": "¿Dónde se ubica Cerro de San Cristóbal y qué altitud de referencia tiene?",
    "respuesta": "Sierra de San Cristóbal, zona de Fregenal de la Sierra; aprox. 917 m.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "MDT/toponimia oficial; verificar cota puntual",
    "apartado": "Cerro de San Cristóbal"
  },
  {
    "id": "CPEI-T36-S04-BFD6A68289",
    "orden": 3370,
    "concepto": "¿Dónde se ubica Peña Utrera y qué altitud de referencia tiene?",
    "respuesta": "Sierra de Hornachos; aprox. 813 m.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "MDT/toponimia oficial; verificar cota puntual",
    "apartado": "Peña Utrera"
  },
  {
    "id": "CPEI-T36-S04-51C8483765",
    "orden": 3380,
    "concepto": "¿Dónde se ubica La Centinela y qué altitud de referencia tiene?",
    "respuesta": "Sierra de San Pedro, sector de Alburquerque; aprox. 703 m.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "MDT/toponimia oficial; verificar cota puntual",
    "apartado": "La Centinela"
  },
  {
    "id": "CPEI-T36-S05-7B8FA3BC15",
    "orden": 3390,
    "concepto": "¿A qué cuenca pertenece el Guadiana y cuál es su recorrido funcional en Badajoz?",
    "respuesta": "cuenca del Guadiana; eje principal de este a oeste; atraviesa Vegas Altas, Mérida, Vegas Bajas y Badajoz hacia Portugal.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía oficial",
    "apartado": "Guadiana"
  },
  {
    "id": "CPEI-T36-S05-BAAF017EE4",
    "orden": 3400,
    "concepto": "¿A qué cuenca pertenece el Zújar y cuál es su recorrido funcional en Badajoz?",
    "respuesta": "cuenca del Guadiana; nace en Sierra Morena, atraviesa La Serena y desemboca en el Guadiana.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía oficial",
    "apartado": "Zújar"
  },
  {
    "id": "CPEI-T36-S05-99FA6D1593",
    "orden": 3410,
    "concepto": "¿A qué cuenca pertenece el Matachel y cuál es su recorrido funcional en Badajoz?",
    "respuesta": "cuenca del Guadiana; recorre el centro-sur y desemboca en el Guadiana en el entorno de Alange.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía oficial",
    "apartado": "Matachel"
  },
  {
    "id": "CPEI-T36-S05-5907106D74",
    "orden": 3420,
    "concepto": "¿A qué cuenca pertenece el Gévora y cuál es su recorrido funcional en Badajoz?",
    "respuesta": "cuenca del Guadiana; procede de Portugal, cruza el noroeste y desemboca cerca de Badajoz.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía oficial",
    "apartado": "Gévora"
  },
  {
    "id": "CPEI-T36-S05-1E8DFEE86D",
    "orden": 3430,
    "concepto": "¿A qué cuenca pertenece el Guadámez y cuál es su recorrido funcional en Badajoz?",
    "respuesta": "cuenca del Guadiana; recorre Tierra de Barros/Guareña y desemboca en el Guadiana.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía oficial",
    "apartado": "Guadámez"
  },
  {
    "id": "CPEI-T36-S05-845FA7851C",
    "orden": 3440,
    "concepto": "¿A qué cuenca pertenece el Ardila y cuál es su recorrido funcional en Badajoz?",
    "respuesta": "cuenca del Guadiana; recorre el suroeste y entra en Portugal.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía oficial",
    "apartado": "Ardila"
  },
  {
    "id": "CPEI-T36-S05-B5B0FB6E5E",
    "orden": 3450,
    "concepto": "¿A qué cuenca pertenece el Alcarrache y cuál es su recorrido funcional en Badajoz?",
    "respuesta": "cuenca del Guadiana; recorre el suroeste provincial hacia el Guadiana.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía oficial",
    "apartado": "Alcarrache"
  },
  {
    "id": "CPEI-T36-S05-804BF77282",
    "orden": 3460,
    "concepto": "¿A qué cuenca pertenece el Bodión y cuál es su recorrido funcional en Badajoz?",
    "respuesta": "cuenca del Guadiana; sur de la provincia, afluente del Ardila.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía oficial",
    "apartado": "Bodión"
  },
  {
    "id": "CPEI-T36-S05-BF1DFE6130",
    "orden": 3470,
    "concepto": "¿A qué cuenca pertenece el Ortiga y cuál es su recorrido funcional en Badajoz?",
    "respuesta": "cuenca del Guadiana; La Serena–Vegas Altas, afluente del Guadiana.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía oficial",
    "apartado": "Ortiga"
  },
  {
    "id": "CPEI-T36-S06-782DE8B9C6",
    "orden": 3480,
    "concepto": "¿Dónde se localiza La Serena?",
    "respuesta": "río Zújar; comarca de La Serena.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "La Serena"
  },
  {
    "id": "CPEI-T36-S06-92E86A0B31",
    "orden": 3490,
    "concepto": "¿Dónde se localiza Zújar?",
    "respuesta": "río Zújar; entorno de Castuera/Esparragosa de Lares.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "Zújar"
  },
  {
    "id": "CPEI-T36-S06-203D362D2B",
    "orden": 3500,
    "concepto": "¿Dónde se localiza Orellana?",
    "respuesta": "río Guadiana; Vegas Altas–Orellana.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "Orellana"
  },
  {
    "id": "CPEI-T36-S06-3390F3AC52",
    "orden": 3510,
    "concepto": "¿Dónde se localiza Cíjara?",
    "respuesta": "río Guadiana; nordeste provincial.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "Cíjara"
  },
  {
    "id": "CPEI-T36-S06-1602493A86",
    "orden": 3520,
    "concepto": "¿Dónde se localiza García de Sola / Puerto Peña?",
    "respuesta": "río Guadiana; Talarrubias–Herrera del Duque.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "García de Sola / Puerto Peña"
  },
  {
    "id": "CPEI-T36-S06-A1DD263767",
    "orden": 3530,
    "concepto": "¿Dónde se localiza Alange?",
    "respuesta": "río Matachel; Alange.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "Alange"
  },
  {
    "id": "CPEI-T36-S06-1635983041",
    "orden": 3540,
    "concepto": "¿Dónde se localiza Los Molinos?",
    "respuesta": "río Matachel; Hornachos.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "Los Molinos"
  },
  {
    "id": "CPEI-T36-S06-AE1F66E806",
    "orden": 3550,
    "concepto": "¿Dónde se localiza Montijo?",
    "respuesta": "río Guadiana; Vegas Bajas.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "Montijo"
  },
  {
    "id": "CPEI-T36-S06-38F90AE742",
    "orden": 3560,
    "concepto": "¿Dónde se localiza Villar del Rey / Peña del Águila?",
    "respuesta": "río Zapatón; Villar del Rey.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "Villar del Rey / Peña del Águila"
  },
  {
    "id": "CPEI-T36-S06-3FD7762AAD",
    "orden": 3570,
    "concepto": "¿Dónde se localiza Tentudía?",
    "respuesta": "entorno de Monesterio/Tentudía.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "Tentudía"
  },
  {
    "id": "CPEI-T36-S06-56C44E4A50",
    "orden": 3580,
    "concepto": "¿Dónde se localiza Piedra Aguda?",
    "respuesta": "Olivenza.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "Piedra Aguda"
  },
  {
    "id": "CPEI-T36-S06-0EBFECFFE3",
    "orden": 3590,
    "concepto": "¿Dónde se localiza Valuengo?",
    "respuesta": "río Ardila; Jerez de los Caballeros.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "Valuengo"
  },
  {
    "id": "CPEI-T36-S06-4961D87A48",
    "orden": 3600,
    "concepto": "¿Dónde se localiza Cornalvo?",
    "respuesta": "arroyo Albarregas; parque natural de Cornalvo.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "Cornalvo"
  },
  {
    "id": "CPEI-T36-S06-79C9784D7C",
    "orden": 3610,
    "concepto": "¿Dónde se localiza Proserpina?",
    "respuesta": "arroyo de Las Pardillas; Mérida.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "Proserpina"
  },
  {
    "id": "CPEI-T36-S06-290EA56D14",
    "orden": 3620,
    "concepto": "¿Dónde se localiza Laguna de La Albuera?",
    "respuesta": "complejo lagunar de La Albuera.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "Laguna de La Albuera"
  },
  {
    "id": "CPEI-T36-S06-CAAF86E55A",
    "orden": 3630,
    "concepto": "¿Dónde se localiza Embalse de Brovales?",
    "respuesta": "Jerez de los Caballeros.",
    "fuente": "SITEX: centro de descargas y cartografía de Extremadura",
    "localizacion": "hidrografía y cartografía oficial",
    "apartado": "Embalse de Brovales"
  }
];
