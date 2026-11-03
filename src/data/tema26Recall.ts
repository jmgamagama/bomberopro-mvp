/** Tema 26 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (Guías INSARAG 2020). Calidad: data/tema26/tema26_calidad.md. */

export type Tema26RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA26_RECALL_META = {
  "tema": 26,
  "title": "Tema 26 · Guías INSARAG Vol. II, Manual B: Operaciones",
  "count": 60,
  "source": "Fase 3 · Guías INSARAG 2020, Vol. II, Manual B: Operaciones (ONU-OCHA, versión oficial en español)"
} as const;

export const TEMA26_RECALL_CARDS: Tema26RecallCard[] = [
  {
    "id": "CPEI-T26-OF-F0774583",
    "orden": 10,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿en cuántos volúmenes se dividen las Guías INSARAG?",
    "respuesta": "Están divididas en tres volúmenes",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 1, pág. 6. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=6",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 1, pág. 6",
    "apartado": "Ciclo de respuesta"
  },
  {
    "id": "CPEI-T26-OF-82CF1DA6",
    "orden": 20,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cómo se titula el Volumen III de las Guías?",
    "respuesta": "Volumen III: Guía Operacional de Campo",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 1, pág. 6. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=6",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 1, pág. 6",
    "apartado": "Ciclo de respuesta"
  },
  {
    "id": "CPEI-T26-OF-35AD9BAA",
    "orden": 30,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cuáles son los cinco componentes de las capacidades USAR?",
    "respuesta": "Gestión/Administración, Búsqueda, Rescate, Médico y Logística",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 1, pág. 6. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=6",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 1, pág. 6",
    "apartado": "Ciclo de respuesta"
  },
  {
    "id": "CPEI-T26-OF-04F5B29A",
    "orden": 40,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cómo se define la fase de preparación del ciclo de respuesta?",
    "respuesta": "Es el período de respuesta entre desastres",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 2.1, pág. 7. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=7",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 2.1, pág. 7",
    "apartado": "Ciclo de respuesta"
  },
  {
    "id": "CPEI-T26-OF-78E5348E",
    "orden": 50,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cómo se define la fase de movilización?",
    "respuesta": "Es el período inmediato tras la presentación de un desastre",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 2.2, pág. 7. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=7",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 2.2, pág. 7",
    "apartado": "Ciclo de respuesta"
  },
  {
    "id": "CPEI-T26-OF-99B368B9",
    "orden": 60,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿con qué comienza la fase de operaciones de un equipo USAR internacional?",
    "respuesta": "Con la llegada del Equipo USAR al Centro de Recepción y Partida (RDC) en el país afectado",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 2.3, pág. 7. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=7",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 2.3, pág. 7",
    "apartado": "Ciclo de respuesta"
  },
  {
    "id": "CPEI-T26-OF-B192957F",
    "orden": 70,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cuándo termina la fase de operaciones?",
    "respuesta": "Cuando al Equipo USAR se le indique que las operaciones concluyeron",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 2.3, pág. 7. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=7",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 2.3, pág. 7",
    "apartado": "Ciclo de respuesta"
  },
  {
    "id": "CPEI-T26-OF-FB5BACB2",
    "orden": 80,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿quién es la autoridad responsable final de la comandancia, coordinación y manejo general de la operación de respuesta?",
    "respuesta": "LEMA",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 3.6, pág. 13. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=13",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 3.6, pág. 13",
    "apartado": "Roles y responsabilidades"
  },
  {
    "id": "CPEI-T26-OF-BE9EA8E1",
    "orden": 90,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué indicadores pueden usarse para declarar el final de la fase de operaciones USAR?",
    "respuesta": "Circunstancias meteorológicas, nivel de daños, y últimas víctimas rescatadas vivas",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 3.5, pág. 13. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=13",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 3.5, pág. 13",
    "apartado": "Roles y responsabilidades"
  },
  {
    "id": "CPEI-T26-OF-989BE82F",
    "orden": 100,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué son los Equipos USAR internacionales?",
    "respuesta": "Activos de respuesta que responden a la ejecución de actividades USAR en estructuras colapsadas y otras actividades de apoyo a desastres y humanitarias",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 3.8, pág. 14. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=14",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 3.8, pág. 14",
    "apartado": "Roles y responsabilidades"
  },
  {
    "id": "CPEI-T26-OF-AA5536DB",
    "orden": 110,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿en qué plazo debe entregarse el Reporte Post misión del Equipo USAR a la Secretaría de INSARAG?",
    "respuesta": "En un plazo de 45 días",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 3.8, pág. 15. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=15",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 3.8, pág. 15",
    "apartado": "Roles y responsabilidades"
  },
  {
    "id": "CPEI-T26-OF-1F31ECA7",
    "orden": 120,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿en qué tiempo máximo debe garantizarse la partida del equipo desde que se solicita la ayuda?",
    "respuesta": "Menos de 10 horas",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 4.2, pág. 18. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=18",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 4.2, pág. 18",
    "apartado": "Ciclo de respuesta"
  },
  {
    "id": "CPEI-T26-OF-8CE24027",
    "orden": 130,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿desde cuándo y hasta cuándo es responsable el Líder del Equipo USAR del personal, equipo y operaciones?",
    "respuesta": "Desde la activación del equipo hasta su regreso al país de origen",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 4.2, pág. 18. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=18",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 4.2, pág. 18",
    "apartado": "Roles y responsabilidades"
  },
  {
    "id": "CPEI-T26-OF-AFF7FDA2",
    "orden": 140,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿desde cuándo debe planificarse y coordinarse la desmovilización?",
    "respuesta": "Desde el inicio de la operación",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 4.4, pág. 22. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=22",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 4.4, pág. 22",
    "apartado": "Ciclo de respuesta"
  },
  {
    "id": "CPEI-T26-OF-FB271045",
    "orden": 150,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿conforme a qué regulaciones se preparan, empacan y etiquetan los productos peligrosos al desmovilizar?",
    "respuesta": "Las regulaciones de la Asociación Internacional de Transporte Aéreo (IATA)",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 4.4, pág. 22. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=22",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 4.4, pág. 22",
    "apartado": "Ciclo de respuesta"
  },
  {
    "id": "CPEI-T26-OF-5D2ECBFD",
    "orden": 160,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿quién debe establecer un RDC de la mano del país anfitrión?",
    "respuesta": "El primer Equipo USAR clasificado",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.2, pág. 24. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=24",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.2, pág. 24",
    "apartado": "Coordinación y sectorización"
  },
  {
    "id": "CPEI-T26-OF-0B0BAB93",
    "orden": 170,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿de qué estructura es subcomponente la Célula de Coordinación USAR (UCC)?",
    "respuesta": "La UCC es un subcomponente de OSOCC",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.2, pág. 24. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=24",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.2, pág. 24",
    "apartado": "Coordinación y sectorización"
  },
  {
    "id": "CPEI-T26-OF-B99719F6",
    "orden": 180,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cuál es el objetivo del proceso de planificación de la coordinación USAR?",
    "respuesta": "Asignar y reasignar equipos a sitios de trabajo priorizados dependiendo de sus capacidades para maximizar la probabilidad de rescates de víctimas vivas",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.2, pág. 25. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=25",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.2, pág. 25",
    "apartado": "Coordinación y sectorización"
  },
  {
    "id": "CPEI-T26-OF-F57F1340",
    "orden": 190,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué evaluación es necesaria si LEMA no tiene plan de sectorización?",
    "respuesta": "Una Evaluación Ampliada del Área (ASR1)",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.5.2, pág. 26. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=26",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.5.2, pág. 26",
    "apartado": "Coordinación y sectorización"
  },
  {
    "id": "CPEI-T26-OF-4CAAEE6A",
    "orden": 200,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿con qué tipo de código identifica INSARAG los sectores?",
    "respuesta": "Un sistema simple con código de letras: A, B, C, D, etc.",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.5.3, pág. 26. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=26",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.5.3, pág. 26",
    "apartado": "Coordinación y sectorización"
  },
  {
    "id": "CPEI-T26-OF-89DDB30F",
    "orden": 210,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cuál es la definición más simple de sitio de trabajo?",
    "respuesta": "Cualquier sitio en el que operaciones USAR significativas se llevan a cabo",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.5.4, pág. 28. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=28",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.5.4, pág. 28",
    "apartado": "Coordinación y sectorización"
  },
  {
    "id": "CPEI-T26-OF-4CEE5341",
    "orden": 220,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cómo se compone la Identificación del Sitio de Trabajo?",
    "respuesta": "La letra del sector y el número asignado",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.5.5, pág. 28. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=28",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.5.5, pág. 28",
    "apartado": "Coordinación y sectorización"
  },
  {
    "id": "CPEI-T26-OF-1B25F543",
    "orden": 230,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿con qué signo debe separarse el código del sector del número del sitio de trabajo?",
    "respuesta": "Por un guion",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.5.5, pág. 28. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=28",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.5.5, pág. 28",
    "apartado": "Coordinación y sectorización"
  },
  {
    "id": "CPEI-T26-OF-888CF4A7",
    "orden": 240,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿de qué dos partes se compone la Identificación del Equipo USAR?",
    "respuesta": "Las tres letras del Código Olímpico del país de origen del equipo y un número de dos dígitos",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.6, pág. 30. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=30",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.6, pág. 30",
    "apartado": "Coordinación y sectorización"
  },
  {
    "id": "CPEI-T26-OF-7F87461D",
    "orden": 250,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué letras usan como identificación los equipos multinacionales como ONGs?",
    "respuesta": "Las letras “SAR”",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.6, pág. 30. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=30",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.6, pág. 30",
    "apartado": "Coordinación y sectorización"
  },
  {
    "id": "CPEI-T26-OF-A304A63E",
    "orden": 260,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué designadores de equipo se reservan a equipos clasificados IEC/IER?",
    "respuesta": "Los designadores de equipos 01 a 09",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.6, pág. 30. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=30",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.6, pág. 30",
    "apartado": "Coordinación y sectorización"
  },
  {
    "id": "CPEI-T26-OF-1819E797",
    "orden": 270,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cuál es el nivel ASR 1?",
    "respuesta": "Evaluación general del área",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.7.1, pág. 31. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=31",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.7.1, pág. 31",
    "apartado": "Niveles ASR"
  },
  {
    "id": "CPEI-T26-OF-DC27C171",
    "orden": 280,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cuál es el nivel ASR 3?",
    "respuesta": "Búsqueda y rescate rápido",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.7.1, pág. 31. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=31",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.7.1, pág. 31",
    "apartado": "Niveles ASR"
  },
  {
    "id": "CPEI-T26-OF-632FA72F",
    "orden": 290,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cuál es el nivel ASR 5?",
    "respuesta": "Búsqueda y recuperación con cobertura total",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.7.1, pág. 31. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=31",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.7.1, pág. 31",
    "apartado": "Niveles ASR"
  },
  {
    "id": "CPEI-T26-OF-3570F5EC",
    "orden": 300,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), en el ASR nivel 1, ¿qué deben hacer los equipos respecto de las operaciones de rescate?",
    "respuesta": "Permanecer móviles y no involucrarse en operaciones de rescate y reportar los resultados tan rápidamente como sea posible",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, Tabla 1, pág. 31. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=31",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, Tabla 1, pág. 31",
    "apartado": "Niveles ASR"
  },
  {
    "id": "CPEI-T26-OF-4940ADEA",
    "orden": 310,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cuál es el propósito principal del ASR nivel 2?",
    "respuesta": "Identificar sitios de rescate viables y específicos de víctimas vivas en el sector asignado",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, Tabla 2, pág. 32. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=32",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, Tabla 2, pág. 32",
    "apartado": "Niveles ASR"
  },
  {
    "id": "CPEI-T26-OF-FD8B5AC9",
    "orden": 320,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), en el ASR nivel 3, ¿en cuánto tiempo es normalmente posible completar la búsqueda y/o rescate?",
    "respuesta": "En un solo período operacional, a veces en unas pocas horas",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, Tabla 3, pág. 33. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=33",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, Tabla 3, pág. 33",
    "apartado": "Niveles ASR"
  },
  {
    "id": "CPEI-T26-OF-05D051C0",
    "orden": 330,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué equipos efectúan el ASR nivel 3?",
    "respuesta": "Equipos USAR Livianos, Medianos y Pesados",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, Tabla 3, pág. 34. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=34",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, Tabla 3, pág. 34",
    "apartado": "Niveles ASR"
  },
  {
    "id": "CPEI-T26-OF-09C99E7D",
    "orden": 340,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué equipos ejecutan el ASR nivel 4?",
    "respuesta": "Equipos USAR Intermedios y Pesados",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, Tabla 4, pág. 35. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=35",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, Tabla 4, pág. 35",
    "apartado": "Niveles ASR"
  },
  {
    "id": "CPEI-T26-OF-7A784882",
    "orden": 350,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿quién ejecuta usualmente el ASR nivel 5?",
    "respuesta": "Los recursos LEMA para efectos de recuperación de cuerpos",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, Tabla 5, pág. 35. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=35",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, Tabla 5, pág. 35",
    "apartado": "Niveles ASR"
  },
  {
    "id": "CPEI-T26-OF-7B160D1C",
    "orden": 360,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué significa la categoría de triage A?",
    "respuesta": "Víctimas vivas confirmadas, menos de 12 horas",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.1, Tabla 6, pág. 37. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=37",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.1, Tabla 6, pág. 37",
    "apartado": "Triage del sitio de trabajo"
  },
  {
    "id": "CPEI-T26-OF-D9EB1ED6",
    "orden": 370,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué significa la categoría de triage B?",
    "respuesta": "Víctimas vivas confirmadas, más de 12 horas",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.1, Tabla 6, pág. 37. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=37",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.1, Tabla 6, pág. 37",
    "apartado": "Triage del sitio de trabajo"
  },
  {
    "id": "CPEI-T26-OF-450C6FED",
    "orden": 380,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué significa la categoría de triage C?",
    "respuesta": "Posibles víctimas vivas",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.1, Tabla 6, pág. 37. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=37",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.1, Tabla 6, pág. 37",
    "apartado": "Triage del sitio de trabajo"
  },
  {
    "id": "CPEI-T26-OF-83D8DF49",
    "orden": 390,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué significa la categoría de triage D?",
    "respuesta": "Fallecidos solamente",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.1, Tabla 6, pág. 37. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=37",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.1, Tabla 6, pág. 37",
    "apartado": "Triage del sitio de trabajo"
  },
  {
    "id": "CPEI-T26-OF-3738FDDA",
    "orden": 400,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué sitios de trabajo se completan antes que las estructuras con posibilidades de víctimas vivas?",
    "respuesta": "Todos los sitios de trabajo con víctimas vivas confirmadas",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.1, pág. 37. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=37",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.1, pág. 37",
    "apartado": "Triage del sitio de trabajo"
  },
  {
    "id": "CPEI-T26-OF-A1848C2B",
    "orden": 410,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cómo se define el colapso tipo panqueque?",
    "respuesta": "Uno o más pisos colapsaron completamente",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.2, pág. 38. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=38",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.2, pág. 38",
    "apartado": "Triage del sitio de trabajo"
  },
  {
    "id": "CPEI-T26-OF-BCF1097B",
    "orden": 420,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cómo se define el colapso en voladizo o suspendido?",
    "respuesta": "Las partes más bajas del edificio colapsaron, dejando la parte más alta saliente sobre la parte más baja",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.2, pág. 38. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=38",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.2, pág. 38",
    "apartado": "Triage del sitio de trabajo"
  },
  {
    "id": "CPEI-T26-OF-629EFB3F",
    "orden": 430,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cómo se define un vacío grande?",
    "respuesta": "Lo suficientemente grande para que una persona avance a rastras",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.2, pág. 38. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=38",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 5.8.2, pág. 38",
    "apartado": "Triage del sitio de trabajo"
  },
  {
    "id": "CPEI-T26-OF-893C51BF",
    "orden": 440,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cuáles son los tres elementos principales del Sistema de Marcaje de INSARAG?",
    "respuesta": "Marcaje Triage, Marcaje de Víctimas y Marcaje de Despeje Rápido (RCM)",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.1, pág. 43. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=43",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.1, pág. 43",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-5727F2FF",
    "orden": 450,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿quién determina el uso del sistema de Marcaje?",
    "respuesta": "LEMA y UCC",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.1, pág. 43. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=43",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.1, pág. 43",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-05D562E7",
    "orden": 460,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), en la orientación de la estructura, ¿qué número identifica el lado de la dirección de la calle (frente)?",
    "respuesta": "Es identificada como “1”",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.1.2, pág. 44. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=44",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.1.2, pág. 44",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-0C2B2073",
    "orden": 470,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿a qué estructuras aplica el Cuadrante E?",
    "respuesta": "Estructuras de varios pisos",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.1.2, pág. 44. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=44",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.1.2, pág. 44",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-71E22F12",
    "orden": 480,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), en el marcaje del sitio de trabajo, ¿qué altura aproximada debe tener la Identificación del Sitio de Trabajo?",
    "respuesta": "Aproximadamente 40 cm de altura",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.2, pág. 47. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=47",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.2, pág. 47",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-7ED1DDB2",
    "orden": 490,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué se traza cuando el trabajo en el sitio está completado y no se requieren otros trabajos?",
    "respuesta": "Una línea horizontal debe trazarse a través del centro",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.2, pág. 47. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=47",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.2, pág. 47",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-46354134",
    "orden": 500,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué datos figuran en el cuadro exterior del marcaje del sitio de trabajo?",
    "respuesta": "Cualquier peligro que requiera identificación, como asbestos (parte superior); categoría de triage (parte inferior)",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.2, pág. 47. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=47",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.2, pág. 47",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-85954865",
    "orden": 510,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué tamaño aproximado debe tener el marcaje de víctimas?",
    "respuesta": "Aproximadamente 50 cm",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.3.1, pág. 51. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=51",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.3.1, pág. 51",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-B518EE9F",
    "orden": 520,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué letra se aplica en la ubicación de todas las víctimas potenciales vivas o muertas?",
    "respuesta": "Una “V”",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.3.2, pág. 51. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=51",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.3.2, pág. 51",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-AFF9EBC6",
    "orden": 530,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), en el marcaje de víctimas, ¿qué indica una “L”?",
    "respuesta": "Víctima viva confirmada",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.3.2, pág. 51. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=51",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.3.2, pág. 51",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-77033778",
    "orden": 540,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), en el marcaje de víctimas, ¿qué indica una “D”?",
    "respuesta": "Víctima fallecida confirmada",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.3.2, pág. 51. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=51",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.3.2, pág. 51",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-D6254708",
    "orden": 550,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿quién debe decidir implementar el Marcaje de Despeje Rápido (RCM)?",
    "respuesta": "Debe tomarse una decisión por parte de LEMA",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.3.4, pág. 52. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=52",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.3.4, pág. 52",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-587FFAC6",
    "orden": 560,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cuáles son las dos opciones de Marcaje RCM?",
    "respuesta": "“Despejado” o “Fallecidos Solamente”",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.3.4, pág. 52. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=52",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.3.4, pág. 52",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-EC89645A",
    "orden": 570,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cuál es la señal sonora de evacuar?",
    "respuesta": "Tres señales cortas de un segundo cada una hasta que el sitio sea despejado",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.4, pág. 55. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=55",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.4, pág. 55",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-584C184F",
    "orden": 580,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cuál es la señal sonora de cesar operaciones (silencio)?",
    "respuesta": "Una señal larga de tres segundos",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.4, pág. 55. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=55",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.4, pág. 55",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-C020C35A",
    "orden": 590,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿cuál es la señal sonora de reanudar operaciones?",
    "respuesta": "Una señal larga más una señal corta",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.4, pág. 55. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=55",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 6.4, pág. 55",
    "apartado": "Marcaje y señalización"
  },
  {
    "id": "CPEI-T26-OF-02AB401B",
    "orden": 600,
    "concepto": "Según las Guías INSARAG (Vol. II, Manual B), ¿qué capacidad básica en materiales peligrosos se requiere a todos los Equipos USAR?",
    "respuesta": "La capacidad básica de detectar y de aislar materiales peligrosos y reportarle la situación a UCC",
    "fuente": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 7.1, pág. 55. Guías INSARAG 2020, Volumen II: Preparación y Respuesta, Manual B: Operaciones (Naciones Unidas, OCHA; aprobadas por el Grupo Directivo de INSARAG); texto íntegro oficial (edición 2020, versión en español publicada por OCHA (PDF de 22/05/2021)): https://www.unocha.org/attachments/4bb0bf45-4c4f-4f49-ab1f-f397f8150ffc/Gu%C3%ADas%20INSARAG%20Volumen%20II%20-%20Manual%20B.pdf#page=55",
    "localizacion": "Guías INSARAG 2020, Vol. II, Manual B, apdo. 7.1, pág. 55",
    "apartado": "Marcaje y señalización"
  }
];
