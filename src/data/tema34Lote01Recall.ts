/** Tema 34 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (BOE-A-2025-7190). Calidad: data/tema34/tema34_lote01_calidad.md. */

export type Tema34RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA34_LOTE01_RECALL_META = {
  "tema": 34,
  "lote": "lote01",
  "title": "Tema 34 · RD 164/2025 (RSCIEI), lote 1: articulado y caracterización (anexo I)",
  "count": 58,
  "source": "Fase 3 · texto consolidado BOE-A-2025-7190 (reglamento, arts. 1-18 y anexo I; últ. act. 20/12/2025)"
} as const;

export const TEMA34_LOTE01_RECALL_CARDS: Tema34RecallCard[] = [
  {
    "id": "CPEI-T34-OF-6D11C066",
    "orden": 10,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué objetivo persiguen las medidas del reglamento?",
    "respuesta": "Minimizar el riesgo de daños a personas, bienes y medioambiente",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 1. Objeto, apdo. 1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 1. Objeto, apdo. 1",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-DC986FCB",
    "orden": 20,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿con qué carácter se aplica el reglamento cuando existen disposiciones sectoriales o específicas de protección contra incendios?",
    "respuesta": "Con carácter complementario y para aquellos aspectos no previstos en ellas",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 1. Objeto, apdo. 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 1. Objeto, apdo. 2",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-8171D9D2",
    "orden": 30,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué establecimientos constituyen su ámbito de aplicación?",
    "respuesta": "Los establecimientos industriales, entendiendo como tales a aquellos cuyo uso principal es industrial",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 2. Ámbito de aplicación, apdo. 1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a2",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 2. Ámbito de aplicación, apdo. 1",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-1A2D3DC3",
    "orden": 40,
    "concepto": "Según el RSCIEI (RD 164/2025), además de actividades industriales y almacenes industriales, ¿qué talleres se consideran uso industrial?",
    "respuesta": "Los talleres de reparación de vehículos",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 2. Ámbito de aplicación, apdo. 1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a2",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 2. Ámbito de aplicación, apdo. 1",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-03E6F2F9",
    "orden": 50,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué actividades quedan excluidas de su ámbito?",
    "respuesta": "Las desarrolladas en establecimientos o instalaciones nucleares y radiactivas, las de extracción de minerales, las actividades agrarias y ganaderas, las instalaciones para usos militares",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 2. Ámbito de aplicación, apdo. 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a2",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 2. Ámbito de aplicación, apdo. 2",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-3DD5F8BE",
    "orden": 60,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué ley define las actividades industriales a efectos del reglamento?",
    "respuesta": "La Ley 21/1992, de 16 de julio, de Industria",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 2. Ámbito de aplicación, apdo. 1.a). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a2",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 2. Ámbito de aplicación, apdo. 1.a)",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-3D2D6B5B",
    "orden": 70,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿a partir de qué carga de fuego total ponderada y corregida se consideran almacenes industriales los logísticos?",
    "respuesta": "Igual o superior a tres millones de megajulios",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 3. Definiciones, letra b). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a3",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 3. Definiciones, letra b)",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-85406BF2",
    "orden": 80,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿pueden estar abiertos al público los almacenes industriales?",
    "respuesta": "Los almacenes industriales no deben ser abiertos al público",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 3. Definiciones, letra b). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a3",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 3. Definiciones, letra b)",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-F767AA02",
    "orden": 90,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿de qué se deriva la protección pasiva contra incendios?",
    "respuesta": "Derivada de los requisitos constructivos de los establecimientos",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 3. Definiciones, letra c). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a3",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 3. Definiciones, letra c)",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-D0FD98BF",
    "orden": 100,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿cómo se define la protección activa contra incendios?",
    "respuesta": "El conjunto de medios, equipos y sistemas, ya sean manuales o automáticos, cuyas funciones específicas son las de actuar de forma activa y directa en la protección contra los incendios",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 3. Definiciones, letra d). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a3",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 3. Definiciones, letra d)",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-1A3481C2",
    "orden": 110,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué son las técnicas de seguridad equivalente?",
    "respuesta": "La adopción de soluciones técnicas que difieren total o parcialmente de las prescripciones técnicas indicadas en el presente reglamento, pero que ofrecen un nivel de seguridad igual o mayor que estas",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 3. Definiciones, letra e). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a3",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 3. Definiciones, letra e)",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-1186260B",
    "orden": 120,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿para qué se diseña específicamente el diseño prestacional?",
    "respuesta": "Para un emplazamiento concreto",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 3. Definiciones, letra f). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a3",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 3. Definiciones, letra f)",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-B352B7B4",
    "orden": 130,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué normativa deben cumplir los espacios de uso no industrial con distinta titularidad en el mismo edificio?",
    "respuesta": "El Documento Básico «Seguridad en Caso de Incendios» (DB-SI) del Código Técnico de la Edificación",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 4. Compatibilidad reglamentaria, apdo. 1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a4",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 4. Compatibilidad reglamentaria, apdo. 1",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-E66331D2",
    "orden": 140,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿a partir de qué superficie construida deben cumplir el CTE DB-SI las zonas administrativas subsidiarias de un establecimiento industrial?",
    "respuesta": "Superficie construida superior a 250 m2",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 4. Compatibilidad reglamentaria, apdo. 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a4",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 4. Compatibilidad reglamentaria, apdo. 2",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-FE6B38D7",
    "orden": 150,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿cuándo deben cumplir el CTE DB-SI las zonas de uso Residencial Vivienda y Residencial Público dentro de un establecimiento industrial?",
    "respuesta": "Siempre",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 4. Compatibilidad reglamentaria, apdo. 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a4",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 4. Compatibilidad reglamentaria, apdo. 2",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-67FAF934",
    "orden": 160,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿a partir de qué superficie construida deben cumplir el CTE DB-SI las zonas de aparcamiento dentro de un establecimiento industrial?",
    "respuesta": "Superficie construida superior a 100 m2",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 4. Compatibilidad reglamentaria, apdo. 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a4",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 4. Compatibilidad reglamentaria, apdo. 2",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-13C05E68",
    "orden": 170,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué deben constituir los espacios subsidiarios que superan las superficies indicadas?",
    "respuesta": "Un sector de incendio independiente al de las zonas con uso industrial",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 4. Compatibilidad reglamentaria, apdo. 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a4",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 4. Compatibilidad reglamentaria, apdo. 2",
    "apartado": "Objeto, ámbito y definiciones"
  },
  {
    "id": "CPEI-T34-OF-28698E2F",
    "orden": 180,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué condición tiene lo dispuesto en el reglamento según la Ley de Industria?",
    "respuesta": "La condición de mínimo exigible según lo indicado en el artículo 12.5 de la Ley 21/1992",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 5. Cumplimiento de las prescripciones, apdo. 1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a5",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 5. Cumplimiento de las prescripciones, apdo. 1",
    "apartado": "Cumplimiento y exigencias básicas"
  },
  {
    "id": "CPEI-T34-OF-B11F76F5",
    "orden": 190,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿bajo responsabilidad de quién se aplican las técnicas de seguridad equivalente o de diseño prestacional?",
    "respuesta": "Bajo responsabilidad del proyectista y previa conformidad del titular del establecimiento",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 5. Cumplimiento de las prescripciones, apdo. 1.b). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a5",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 5. Cumplimiento de las prescripciones, apdo. 1.b)",
    "apartado": "Cumplimiento y exigencias básicas"
  },
  {
    "id": "CPEI-T34-OF-7499527E",
    "orden": 200,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿hasta qué densidad de carga de fuego ponderada y corregida quedan exceptuados los establecimientos pequeños?",
    "respuesta": "No supere 42 MJ/m2",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 5. Cumplimiento de las prescripciones, apdo. 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a5",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 5. Cumplimiento de las prescripciones, apdo. 2",
    "apartado": "Cumplimiento y exigencias básicas"
  },
  {
    "id": "CPEI-T34-OF-6EA6EE68",
    "orden": 210,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué superficie construida máxima deben tener los establecimientos exceptuados por su baja carga de fuego?",
    "respuesta": "Inferior o igual a 120 m2",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 5. Cumplimiento de las prescripciones, apdo. 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a5",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 5. Cumplimiento de las prescripciones, apdo. 2",
    "apartado": "Cumplimiento y exigencias básicas"
  },
  {
    "id": "CPEI-T34-OF-DDE8D419",
    "orden": 220,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué instalaciones del anexo III deben cumplir los establecimientos exceptuados por su baja carga de fuego?",
    "respuesta": "Los apartados del anexo III referentes a extintores y alumbrado de emergencia",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 5. Cumplimiento de las prescripciones, apdo. 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a5",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 5. Cumplimiento de las prescripciones, apdo. 2",
    "apartado": "Cumplimiento y exigencias básicas"
  },
  {
    "id": "CPEI-T34-OF-D077201A",
    "orden": 230,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué pueden usarse excepcionalmente en naves de polígonos con planeamiento anterior o edificios existentes?",
    "respuesta": "Adaptaciones razonables que difieran de lo indicado en los artículos 7 y 8",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 5. Cumplimiento de las prescripciones, apdo. 3. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a5",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 5. Cumplimiento de las prescripciones, apdo. 3",
    "apartado": "Cumplimiento y exigencias básicas"
  },
  {
    "id": "CPEI-T34-OF-A8A8D69D",
    "orden": 240,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿durante cuánto tiempo debe mantener la estructura portante su resistencia al fuego?",
    "respuesta": "Durante el tiempo necesario para que puedan cumplirse las anteriores exigencias básicas",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 6. Exigencias básicas de seguridad en caso de incendio, apdo. 1.f). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a6",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 6. Exigencias básicas de seguridad en caso de incendio, apdo. 1.f)",
    "apartado": "Cumplimiento y exigencias básicas"
  },
  {
    "id": "CPEI-T34-OF-CB75D855",
    "orden": 250,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿en qué anexo se establece la caracterización de los establecimientos?",
    "respuesta": "En el anexo I",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 7. Caracterización. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a7",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 7. Caracterización",
    "apartado": "Cumplimiento y exigencias básicas"
  },
  {
    "id": "CPEI-T34-OF-D5792386",
    "orden": 260,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿en qué anexo se establecen los requisitos constructivos?",
    "respuesta": "Los establecidos en el anexo II",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 8. Requisitos constructivos y determinación de las instalaciones de protección contra incendios necesarias, apdo. 1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a8",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 8. Requisitos constructivos y determinación de las instalaciones de protección contra incendios necesarias, apdo. 1",
    "apartado": "Cumplimiento y exigencias básicas"
  },
  {
    "id": "CPEI-T34-OF-D0125C4A",
    "orden": 270,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿en qué anexo se establecen las dotaciones de instalaciones de protección activa?",
    "respuesta": "Las establecidas en el anexo III",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 8. Requisitos constructivos y determinación de las instalaciones de protección contra incendios necesarias, apdo. 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a8",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 8. Requisitos constructivos y determinación de las instalaciones de protección contra incendios necesarias, apdo. 2",
    "apartado": "Cumplimiento y exigencias básicas"
  },
  {
    "id": "CPEI-T34-OF-767AC999",
    "orden": 280,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué recoge el anexo IV?",
    "respuesta": "Requisitos aplicables para casos singulares de zonas o partes de establecimientos",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 8. Requisitos constructivos y determinación de las instalaciones de protección contra incendios necesarias, apdo. 3. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a8",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 8. Requisitos constructivos y determinación de las instalaciones de protección contra incendios necesarias, apdo. 3",
    "apartado": "Cumplimiento y exigencias básicas"
  },
  {
    "id": "CPEI-T34-OF-22E4160A",
    "orden": 290,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿quién redacta y firma el proyecto de un establecimiento industrial?",
    "respuesta": "Una persona técnica titulada competente",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 10. Proyectos de construcción e implantación, apdo. 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-2",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 10. Proyectos de construcción e implantación, apdo. 2",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-9E88BAB0",
    "orden": 300,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué informe debe anexarse al proyecto cuando se usan técnicas de seguridad equivalente o diseño prestacional?",
    "respuesta": "Un informe de tercera parte independiente donde se valide positivamente la eficacia y adecuación de las soluciones técnicas, emitido por un organismo de control habilitado",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 10. Proyectos de construcción e implantación, apdo. 3. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-2",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 10. Proyectos de construcción e implantación, apdo. 3",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-427E5D22",
    "orden": 310,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿ante qué órgano se presenta la comunicación para la puesta en servicio?",
    "respuesta": "Ante el órgano competente en materia de industria de la correspondiente comunidad autónoma o de las ciudades de Ceuta y Melilla",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 11. Puesta en servicio, apdo. 1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-3",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 11. Puesta en servicio, apdo. 1",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-E368E443",
    "orden": 320,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿a partir de qué superficie de sectores de riesgo medio y alto se exige acta de inspección inicial de un organismo de control?",
    "respuesta": "Un total de 1.000 m2 o más",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 11. Puesta en servicio, apdo. 1.c). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-3",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 11. Puesta en servicio, apdo. 1.c)",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-52148371",
    "orden": 330,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué documento alternativo a la comunicación puede exigirse para la puesta en servicio?",
    "respuesta": "Una declaración responsable",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 11. Puesta en servicio, apdo. 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-3",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 11. Puesta en servicio, apdo. 2",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-8082AA8A",
    "orden": 340,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿quiénes son responsables de que los establecimientos se utilicen y mantengan en condiciones adecuadas?",
    "respuesta": "Los titulares de los establecimientos industriales",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 12. Funcionamiento, mantenimiento y modificaciones, apdo. 1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-4",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 12. Funcionamiento, mantenimiento y modificaciones, apdo. 1",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-E17D07FF",
    "orden": 350,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué real decreto aprueba la Norma Básica de Autoprotección citada en el reglamento?",
    "respuesta": "Real Decreto 393/2007, de 23 de marzo",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 12. Funcionamiento, mantenimiento y modificaciones, apdo. 3. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-4",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 12. Funcionamiento, mantenimiento y modificaciones, apdo. 3",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-1CAEA00A",
    "orden": 360,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué deben volver a presentarse si se realizan modificaciones significativas tras la puesta en servicio?",
    "respuesta": "Los documentos requeridos en los artículos 10 y 11 para la parte afectada",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 12. Funcionamiento, mantenimiento y modificaciones, apdo. 4. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-4",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 12. Funcionamiento, mantenimiento y modificaciones, apdo. 4",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-E4F6A9E6",
    "orden": 370,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿con qué periodicidad mínima deben realizarse las inspecciones periódicas?",
    "respuesta": "Al menos, cada 5 años",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 13. Inspecciones periódicas, apdo. 1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-5",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 13. Inspecciones periódicas, apdo. 1",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-2F1630B7",
    "orden": 380,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿a quién deben solicitar los titulares la inspección periódica?",
    "respuesta": "A un organismo de control habilitado",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 13. Inspecciones periódicas, apdo. 1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-5",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 13. Inspecciones periódicas, apdo. 1",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-C9EAF98C",
    "orden": 390,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué norma UNE fija los procedimientos de las inspecciones periódicas?",
    "respuesta": "La norma UNE 192005-1",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 13. Inspecciones periódicas, apdo. 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-5",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 13. Inspecciones periódicas, apdo. 2",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-32340A06",
    "orden": 400,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿quiénes firman el acta de la inspección periódica?",
    "respuesta": "La persona inspectora del organismo de control y por el titular de la instalación",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 13. Inspecciones periódicas, apdo. 3. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-5",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 13. Inspecciones periódicas, apdo. 3",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-7F160BC9",
    "orden": 410,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿previa consulta con qué consejo pueden promoverse programas especiales de inspección?",
    "respuesta": "Previa consulta con el Consejo de Coordinación para la Seguridad Industrial",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 14. Programas especiales de inspección, apdo. 1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-6",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 14. Programas especiales de inspección, apdo. 1",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-009F4D7A",
    "orden": 420,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué plazo máximo se fija para demostrar que se han aplicado las medidas correctoras de deficiencias significativas?",
    "respuesta": "No deberá ser superior a 6 meses",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 15. Medidas correctoras, apdo. 1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-7",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 15. Medidas correctoras, apdo. 1",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-C1DF1747",
    "orden": 430,
    "concepto": "Según el RSCIEI (RD 164/2025), si las deficiencias suponen un riesgo grave e inminente, ¿qué emite el organismo de control?",
    "respuesta": "Un certificado de inspección con calificación negativa",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 15. Medidas correctoras, apdo. 2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-7",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 15. Medidas correctoras, apdo. 2",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-752A0BC3",
    "orden": 440,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿en qué plazo máximo debe comunicar el titular determinados incendios al órgano competente en materia de industria?",
    "respuesta": "En el plazo máximo de 15 días hábiles",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 16. Comunicación de incendios. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-8",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 16. Comunicación de incendios",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-BE6A8CAA",
    "orden": 450,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué duración de paralización parcial de la actividad obliga a comunicar el incendio?",
    "respuesta": "Superior a 14 días",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 16. Comunicación de incendios, letra c). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-8",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 16. Comunicación de incendios, letra c)",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-36185060",
    "orden": 460,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué importe de daños materiales obliga a comunicar el incendio?",
    "respuesta": "Superiores a 30.000 euros",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 16. Comunicación de incendios, letra d). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-8",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 16. Comunicación de incendios, letra d)",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-59760614",
    "orden": 470,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿a qué conferencia se traslada la información de los incendios investigados?",
    "respuesta": "A la Conferencia Sectorial de Industria y PYME",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 17. Investigación de incendios. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-9",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 17. Investigación de incendios",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-75F9ACE0",
    "orden": 480,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿conforme a qué título de la Ley de Industria se clasifican y sancionan las infracciones?",
    "respuesta": "El título V de la Ley 21/1992, de 16 de julio, de Industria",
    "fuente": "RD 164/2025 (RSCIEI), Artículo 18. Infracciones y sanciones. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#a1-10",
    "localizacion": "RD 164/2025 (RSCIEI), Artículo 18. Infracciones y sanciones",
    "apartado": "Proyecto, puesta en servicio, inspección e incendios"
  },
  {
    "id": "CPEI-T34-OF-C6BDD8AD",
    "orden": 490,
    "concepto": "Según el RSCIEI (RD 164/2025), si la separación con otros establecimientos mezcla características AV y AH, ¿qué tipo se considera?",
    "respuesta": "Se considerará tipo AV",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 1.1.1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 1.1.1",
    "apartado": "Anexo I: caracterización"
  },
  {
    "id": "CPEI-T34-OF-4C406A79",
    "orden": 500,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿a qué distancia máxima de edificios de otro establecimiento se sitúa un edificio tipo B que no es adyacente?",
    "respuesta": "Igual o inferior a tres metros",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 1.1.2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 1.1.2",
    "apartado": "Anexo I: caracterización"
  },
  {
    "id": "CPEI-T34-OF-25DCB64B",
    "orden": 510,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué distancia de separación al edificio más próximo de otros establecimientos caracteriza al edificio tipo C?",
    "respuesta": "Superior a tres metros",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 1.1.3. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 1.1.3",
    "apartado": "Anexo I: caracterización"
  },
  {
    "id": "CPEI-T34-OF-64810F29",
    "orden": 520,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿de qué debe estar libre la distancia de separación de un edificio tipo C?",
    "respuesta": "Libre de mercancías combustibles o elementos intermedios susceptibles de propagar el incendio",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 1.1.3. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 1.1.3",
    "apartado": "Anexo I: caracterización"
  },
  {
    "id": "CPEI-T34-OF-B6EC71C3",
    "orden": 530,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿qué configuración tiene un establecimiento que ocupa un espacio abierto?",
    "respuesta": "Espacio tipo D",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 1.2. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 1.2",
    "apartado": "Anexo I: caracterización"
  },
  {
    "id": "CPEI-T34-OF-C3677FCD",
    "orden": 540,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿cómo se define el sector de incendio?",
    "respuesta": "Zona de un edificio en el interior de la cual se puede confinar (o excluir) el incendio durante un periodo de tiempo determinado",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 2.1.a). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 2.1.a)",
    "apartado": "Anexo I: caracterización"
  },
  {
    "id": "CPEI-T34-OF-F01E88E1",
    "orden": 550,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿cómo se define el área de incendio?",
    "respuesta": "Espacio abierto separado de otras zonas y definido por su perímetro",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 2.1.b). BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 2.1.b)",
    "apartado": "Anexo I: caracterización"
  },
  {
    "id": "CPEI-T34-OF-A311DC05",
    "orden": 560,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿en qué niveles se clasifica el nivel de riesgo intrínseco?",
    "respuesta": "Bajo, medio o alto",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 3.1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 3.1",
    "apartado": "Anexo I: caracterización"
  },
  {
    "id": "CPEI-T34-OF-60C1D437",
    "orden": 570,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿entre qué valores se subclasifica el nivel de riesgo intrínseco?",
    "respuesta": "Entre los valores de 1 a 8",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 3.1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 3.1",
    "apartado": "Anexo I: caracterización"
  },
  {
    "id": "CPEI-T34-OF-A016AB40",
    "orden": 580,
    "concepto": "Según el RSCIEI (RD 164/2025), ¿en función de qué parámetro se subclasifica el nivel de riesgo intrínseco?",
    "respuesta": "En función de la densidad de carga de fuego ponderada y corregida (Qs)",
    "fuente": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 3.1. BOE-A-2025-7190, texto consolidado (últ. actualización 20/12/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190#ai",
    "localizacion": "RD 164/2025 (RSCIEI), ANEXO I, apdo. 3.1",
    "apartado": "Anexo I: caracterización"
  }
];
