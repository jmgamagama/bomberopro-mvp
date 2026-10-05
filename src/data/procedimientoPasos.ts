/**
 * Pasos ordenados extraídos fielmente de fichas de procedimiento (temas 38 y 40).
 * Solo recall / ordenación; sin opciones inventadas de examen.
 */

export interface ProcedimientoPasos {
  id: string;
  titulo: string;
  pasos: string[];
  fuente: string;
}

export const PROCEDIMIENTO_PASOS: ProcedimientoPasos[] = [
  {
    "id": "CPEI-T40-PT03-079",
    "titulo": "¿Cuáles son las fases de la intervención en que se estructura el procedimiento del apartado 9?",
    "pasos": [
      "Fase cero: aviso y activación de los servicios de emergencia",
      "Fase 1: aproximación, valoración inicial y ubicación de vehículos",
      "Fase 2: intervención",
      "Fase 3: fin de la intervención, limpieza gruesa in situ",
      "Fase 4: llegada al parque",
      "Fase 5: restitución de la normalidad"
    ],
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) · 9. Procedimiento de trabajo con posible presencia de fibras de amianto friable"
  },
  {
    "id": "CPEI-T40-PT03-093",
    "titulo": "Definida la estrategia, ¿qué tres pasos se ejecutan en la ubicación de vehículos (F.1.C)?",
    "pasos": [
      "F.1.C.1 Operación de acercamiento",
      "F.1.C.2 Definir zona de descontaminación",
      "F.1.C.3 Colocación de EPI"
    ],
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos"
  },
  {
    "id": "CPEI-T40-PT03-103",
    "titulo": "¿Cuál es el orden completo de colocación de EPI en la activación desde el parque (C.3.A, rescate sin fuego)? (8 pasos)?",
    "pasos": [
      "Buzo de protección/termo capuz tipo 5 impermeable a partículas, precintado tobillos, con caperuza colocada",
      "Doble guante de nitrilo, precintando las mangas del buzo con los guantes",
      "Traje de rescate técnico",
      "Media máscara con filtros contra partículas tipo P3",
      "Gafas de seguridad herméticas (UNE-EN 166)",
      "Casco de rescate técnico (según tipo de intervención de origen)",
      "Guantes de excarcelación o trabajo (según proceda) encima de los guantes de nitrilo",
      "Botas de intervención"
    ],
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.A Activación del procedimiento desde el parque"
  },
  {
    "id": "CPEI-T40-PT03-109",
    "titulo": "¿Cuál es el orden completo de colocación de los EPI «encima» en C.3.B (activación en el lugar)? (6 pasos)?",
    "pasos": [
      "Cubre pantalón y botas colocadas",
      "Doble guante de nitrilo",
      "Chaquetón, colocando el adaptador de las mangas encima del guante de nitrilo",
      "Protección respiratoria (con fuego: ERA; sin fuego: media máscara P3 o mascarilla P3/FP3)",
      "Casco de intervención",
      "Guantes de intervención/técnicos encima de los guantes de vinilo"
    ],
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) · 9.2. Fase 1: aproximación, valoración inicial y ubicación de vehículos › C. Ubicación de vehículos › F.1.C.3 Colocación de EPI´s › C.3.B Activación del procedimiento en el lugar de la intervención"
  },
  {
    "id": "CPEI-T40-PT03-122",
    "titulo": "Junto al vehículo, ¿cuál es la secuencia de limpieza del material que puede mojarse (mangueras, herramienta…)?",
    "pasos": [
      "Limpieza in situ con agua a presión que no dañe el material",
      "Encapsulado de los equipos en bolsa de plástico y precintar",
      "Introducir la bolsa en una segunda bolsa con indicativo de amianto, cerrándola herméticamente"
    ],
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.1 Limpieza in situ con agua"
  },
  {
    "id": "CPEI-T40-PT03-123",
    "titulo": "En la Lona 1, ¿cuál es la secuencia de limpieza de los equipos que no pueden manguearse (cámaras térmicas, walkis, linternas…)?",
    "pasos": [
      "Aspirar con la aspiradora AS 30-PRO (siempre que su tecnología lo permita)",
      "Limpiar con bayeta húmeda",
      "Encapsular en bolsa de plástico y precintar",
      "Introducir la bolsa en una segunda bolsa con indicativo de amianto, cerrándola herméticamente"
    ],
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.1 Limpieza in situ con agua"
  },
  {
    "id": "CPEI-T40-PT03-125",
    "titulo": "¿Cuál es la secuencia de limpieza de EPI con agua por pareja? (4 pasos)?",
    "pasos": [
      "Los operarios en pareja manguean al compañero con todo el equipo puesto (incluido ERACA) para hacer la primera eliminación de polvo; una vez limpiado el traje del binomio, se repite con el MRI",
      "Limpieza exterior del casco con bayeta mojada",
      "Limpieza del equipo de respiración: espaldera, botella, media máscara",
      "Botas de intervención"
    ],
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.1 Limpieza in situ con agua"
  },
  {
    "id": "CPEI-T40-PT03-127",
    "titulo": "¿Cuál es el orden completo de retirada de EPI en la Lona 2? (7 pasos)?",
    "pasos": [
      "Guantes de intervención (a bolsa de EPI INDIVIDUAL, manteniendo los guantes de nitrilo)",
      "Equipo de respiración: desabrochar espaldera y desconectar",
      "Retirar la máscara de presión positiva y colocar de inmediato protección respiratoria frente a partículas (media máscara P3 o mascarilla P3/FP3)",
      "Casco: desmontar el atalaje y embolsar (INDIVIDUAL)",
      "Traje de intervención (situación A con buzo debajo o B sin buzo)",
      "Botas: se retiran junto con el cubre pantalón, se limpian con agua y a bolsa INDIVIDUAL; se colocan botas de sustitución",
      "Gafas: se retiran, se limpian con agua y a bolsa INDIVIDUAL"
    ],
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.2 Retirada de EPI´s (Lona 2)"
  },
  {
    "id": "CPEI-T40-PT03-132",
    "titulo": "En la retirada del traje (paso 5º), situación B (sin buzo nivel 5), ¿cuál es la secuencia?",
    "pasos": [
      "Retirar el traje técnico o de intervención con ayuda de la pareja, sin movimientos bruscos, metiéndolo en bolsa de EPI INDIVIDUAL y esta en otra bolsa señalizada con contenido de amianto",
      "El operario se coloca el buzo tipo 5, con la capucha",
      "Introducir los equipos en bolsa de EPI INDIVIDUAL de cada interviniente"
    ],
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) · 9.4. Fase 3: fin de la intervención. Limpieza gruesa in situ › F.3.2 Retirada de EPI´s (Lona 2)"
  },
  {
    "id": "CPEI-T40-PT03-150",
    "titulo": "¿Cuál es la secuencia de aseo personal de bomberos y conductor en la zona sucia del parque?",
    "pasos": [
      "Retirada por pareja de los buzos tipo 5, a la bolsa de MATERIAL DESECHABLE",
      "Ducharse con guantes y mascarilla puestos",
      "Lavados cuerpo y cabeza, retirar los guantes desechables (bolsa de MATERIAL DESECHABLE)",
      "Antes de vestirse, retirar la protección respiratoria: máscara facial en bolsa de EPI y filtros en bolsa de material desechable; enjuagarse después la cara",
      "Toda la ropa utilizada, en bolsa para lavado inmediato en la lavadora del parque",
      "En la zona limpia, ponerse ropa limpia y seca"
    ],
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) · 9.5. Fase 4: llegada al parque › F.4.3 Aseo personal"
  },
  {
    "id": "CPEI-T40-PT03-172",
    "titulo": "¿Qué EPI se colocan los operarios de lavandería antes de entrar en la sala de sucio y en qué orden?",
    "pasos": [
      "Guantes de vinilo (UNE-EN 374)",
      "Buzo de protección/termo capuz tipo 5 impermeable a partículas, precintado mangas y tobillos, con caperuza colocada (EN 13982-1)",
      "Mascarillas con filtros contra partículas tipo P3 (UNE-EN 149)",
      "Gafas de seguridad herméticas (UNE-EN 166). Queda completamente prohibida su retirada durante la descontaminación"
    ],
    "fuente": "PT03 Procedimiento de trabajo con amianto, edición 2 (30/05/2023) · 10. Lavado en lavandería central › 10.1 Procedimiento de lavado en lavandería de base"
  },
  {
    "id": "CPEI-T38-HOR-050",
    "titulo": "Describe la cadena de gestión de una incidencia de material individual no operativo (pasos 1-3).?",
    "pasos": [
      "Jefe de turno entrante contacta verbal o telefónicamente con JP (o JG), registra en Tarea Programada de Revisión Diaria (Archivada) y genera incidencia",
      "JP (o JG) comunica al superior jerárquico operativo y deja registro en Incidencias del SOS",
      "Suboficial (o Oficial) resuelve (reposición con stock o compra) y deja constancia en Incidencias del SOS"
    ],
    "fuente": "ITF Horario de actividades, edición 2 (29/06/2022; fecha original 21/06/2020) · 4. Falta de material › cadena"
  },
  {
    "id": "CPEI-T38-HOR-077",
    "titulo": "¿Cuál es el orden de revisión de vehículos según el Anexo I?",
    "pasos": [
      "Bombas urbanas primera salida",
      "Pick up de rescate/extinción",
      "Autoescala",
      "Bomba rural/forestal",
      "Bomba nodriza pesada",
      "Unidad de mando y jefatura",
      "Unidad de transporte y carga"
    ],
    "fuente": "ITF Horario de actividades, edición 2 (29/06/2022; fecha original 21/06/2020) · Anexo I › Orden de vehículos"
  },
  {
    "id": "CPEI-T38-VES-019",
    "titulo": "Describe la secuencia de solicitud de sustitución de vestuario (pasos 1º a 3º).?",
    "pasos": [
      "Bombero registra incidencia en SOS indicando el nº de parte",
      "Jefe de Parque supervisa y, si procede, eleva a la Jefa de Servicio",
      "Jefa de Servicio comunica la resolución al JP y al almacén (si aprueba) a través de la incidencia en SOS"
    ],
    "fuente": "ITF Vestuario de permanencia y EPIs, edición 3ª (19/01/2026; fecha original 29/06/2022) · 4.2. Sustitución de vestuario › procedimiento"
  },
  {
    "id": "CPEI-T38-LIM-021",
    "titulo": "Enumera las fases del procedimiento interno de limpieza en parque.?",
    "pasos": [
      "Inspección inicial de la prenda",
      "Ventilación inicial de la prenda (si hubo exposición a humo/gases sin necesidad de vía húmeda)",
      "Mantenimiento húmedo manual o limpieza en máquina"
    ],
    "fuente": "ITF 03 Limpieza de EPIs en parque, edición 3ª (aprobación enero 2026; fecha original 15/11/2022) · 2.1. Pasos a seguir"
  },
  {
    "id": "CPEI-T38-LIM-027",
    "titulo": "Describe los pasos de limpieza de cascos en parque.?",
    "pasos": [
      "Enjuagar copa y componentes interiores con abundante agua (~40ºC)",
      "Frotar superficie con paño de microfibra o esponja",
      "Enjuagar el casco completo con agua caliente ~40ºC",
      "Secar al aire 24 h. Prohibido material abrasivo o con base de disolvente (acetona, alcohol) o agentes ablandadores"
    ],
    "fuente": "ITF 03 Limpieza de EPIs en parque, edición 3ª (aprobación enero 2026; fecha original 15/11/2022) · Cascos"
  }
];

/** Selecciona tarjetas con pasos ordenados (≥3) para el modo «ordena los pasos». */
export function getProcedimientosConPasos(): ProcedimientoPasos[] {
  return PROCEDIMIENTO_PASOS.filter((c) => Array.isArray(c.pasos) && c.pasos.length >= 3);
}
