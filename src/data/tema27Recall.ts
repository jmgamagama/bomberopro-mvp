/** Tema 27 recall cards — fase 2: generadas SOLO desde el texto oficial consolidado (DB SE, DB SE-AE). Calidad: data/tema27/tema27_calidad.md. */

export type Tema27RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA27_RECALL_META = {
  "tema": 27,
  "title": "Tema 27 · Edificación: acciones y estados límite (CTE DB SE y DB SE-AE)",
  "count": 22,
  "source": "Fase 3 · CTE DB SE (RD 732/2019) y DB SE-AE (Orden VIV/984/2009), textos consolidados del Ministerio en codigotecnico.org"
} as const;

export const TEMA27_RECALL_CARDS: Tema27RecallCard[] = [
  {
    "id": "CPEI-T27-OF-FBD171A0",
    "orden": 10,
    "concepto": "Según el CTE DB SE, ¿a qué condiciones se refieren las situaciones de dimensionado persistentes?",
    "respuesta": "Se refieren a las condiciones normales de uso",
    "fuente": "CTE DB SE, apdo. 3.1, pág. 11. DB SE del CTE (RD 314/2006, modificado por última vez por RD 732/2019); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 732/2019 (BOE 27/12/2019); PDF de 27/12/2019): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE.pdf#page=11",
    "localizacion": "CTE DB SE, apdo. 3.1, pág. 11",
    "apartado": "Situaciones de dimensionado"
  },
  {
    "id": "CPEI-T27-OF-43ED1B33",
    "orden": 20,
    "concepto": "Según el CTE DB SE, ¿qué acciones caracterizan las situaciones de dimensionado extraordinarias?",
    "respuesta": "Acciones accidentales",
    "fuente": "CTE DB SE, apdo. 3.1, pág. 11. DB SE del CTE (RD 314/2006, modificado por última vez por RD 732/2019); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 732/2019 (BOE 27/12/2019); PDF de 27/12/2019): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE.pdf#page=11",
    "localizacion": "CTE DB SE, apdo. 3.1, pág. 11",
    "apartado": "Situaciones de dimensionado"
  },
  {
    "id": "CPEI-T27-OF-4E6D4DC3",
    "orden": 30,
    "concepto": "Según el CTE DB SE, ¿qué son los estados límite?",
    "respuesta": "Aquellas situaciones para las que, de ser superadas, puede considerarse que el edificio no cumple alguna de los requisitos estructurales para las que ha sido concebido",
    "fuente": "CTE DB SE, apdo. 3.2, pág. 11. DB SE del CTE (RD 314/2006, modificado por última vez por RD 732/2019); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 732/2019 (BOE 27/12/2019); PDF de 27/12/2019): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE.pdf#page=11",
    "localizacion": "CTE DB SE, apdo. 3.2, pág. 11",
    "apartado": "Estados límite"
  },
  {
    "id": "CPEI-T27-OF-37BF96F8",
    "orden": 40,
    "concepto": "Según el CTE DB SE, ¿qué son los estados límite últimos?",
    "respuesta": "Los que, de ser superados, constituyen un riesgo para las personas, ya sea porque producen una puesta fuera de servicio del edificio o el colapso total o parcial del mismo",
    "fuente": "CTE DB SE, apdo. 3.2.1, pág. 11. DB SE del CTE (RD 314/2006, modificado por última vez por RD 732/2019); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 732/2019 (BOE 27/12/2019); PDF de 27/12/2019): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE.pdf#page=11",
    "localizacion": "CTE DB SE, apdo. 3.2.1, pág. 11",
    "apartado": "Estados límite"
  },
  {
    "id": "CPEI-T27-OF-16702B4F",
    "orden": 50,
    "concepto": "Según el CTE DB SE, ¿qué fallos dependientes del tiempo se citan entre los estados límite últimos?",
    "respuesta": "Corrosión, fatiga",
    "fuente": "CTE DB SE, apdo. 3.2.1, pág. 11. DB SE del CTE (RD 314/2006, modificado por última vez por RD 732/2019); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 732/2019 (BOE 27/12/2019); PDF de 27/12/2019): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE.pdf#page=11",
    "localizacion": "CTE DB SE, apdo. 3.2.1, pág. 11",
    "apartado": "Estados límite"
  },
  {
    "id": "CPEI-T27-OF-F822D21A",
    "orden": 60,
    "concepto": "Según el CTE DB SE, ¿a qué afectan los estados límite de servicio si se superan?",
    "respuesta": "Afectan al confort y al bienestar de los usuarios o de terceras personas, al correcto funcionamiento",
    "fuente": "CTE DB SE, apdo. 3.2.2, pág. 11. DB SE del CTE (RD 314/2006, modificado por última vez por RD 732/2019); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 732/2019 (BOE 27/12/2019); PDF de 27/12/2019): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE.pdf#page=11",
    "localizacion": "CTE DB SE, apdo. 3.2.2, pág. 11",
    "apartado": "Estados límite"
  },
  {
    "id": "CPEI-T27-OF-393F3A26",
    "orden": 70,
    "concepto": "Según el CTE DB SE, ¿qué son las acciones permanentes (G)?",
    "respuesta": "Aquellas que actúan en todo instante sobre el edificio con posición constante",
    "fuente": "CTE DB SE, apdo. 3.3.2.1, pág. 12. DB SE del CTE (RD 314/2006, modificado por última vez por RD 732/2019); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 732/2019 (BOE 27/12/2019); PDF de 27/12/2019): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE.pdf#page=12",
    "localizacion": "CTE DB SE, apdo. 3.3.2.1, pág. 12",
    "apartado": "Clasificación de las acciones"
  },
  {
    "id": "CPEI-T27-OF-DEAA4D5F",
    "orden": 80,
    "concepto": "Según el CTE DB SE, ¿qué ejemplos de acciones variables (Q) cita el DB SE?",
    "respuesta": "Las debidas al uso o las acciones climáticas",
    "fuente": "CTE DB SE, apdo. 3.3.2.1, pág. 12. DB SE del CTE (RD 314/2006, modificado por última vez por RD 732/2019); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 732/2019 (BOE 27/12/2019); PDF de 27/12/2019): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE.pdf#page=12",
    "localizacion": "CTE DB SE, apdo. 3.3.2.1, pág. 12",
    "apartado": "Clasificación de las acciones"
  },
  {
    "id": "CPEI-T27-OF-C92D4ED1",
    "orden": 90,
    "concepto": "Según el CTE DB SE, ¿qué son las acciones accidentales (A)?",
    "respuesta": "Aquellas cuya probabilidad de ocurrencia es pequeña pero de gran importancia, como sismo, incendio, impacto o explosión",
    "fuente": "CTE DB SE, apdo. 3.3.2.1, pág. 12. DB SE del CTE (RD 314/2006, modificado por última vez por RD 732/2019); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 732/2019 (BOE 27/12/2019); PDF de 27/12/2019): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE.pdf#page=12",
    "localizacion": "CTE DB SE, apdo. 3.3.2.1, pág. 12",
    "apartado": "Clasificación de las acciones"
  },
  {
    "id": "CPEI-T27-OF-00789D56",
    "orden": 100,
    "concepto": "Según el CTE DB SE, ¿cómo se consideran las deformaciones impuestas como asientos o retracción?",
    "respuesta": "Como acciones permanentes o variables, atendiendo a su variabilidad",
    "fuente": "CTE DB SE, apdo. 3.3.2.1, pág. 12. DB SE del CTE (RD 314/2006, modificado por última vez por RD 732/2019); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 732/2019 (BOE 27/12/2019); PDF de 27/12/2019): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE.pdf#page=12",
    "localizacion": "CTE DB SE, apdo. 3.3.2.1, pág. 12",
    "apartado": "Clasificación de las acciones"
  },
  {
    "id": "CPEI-T27-OF-F0DE533F",
    "orden": 110,
    "concepto": "Según el CTE DB SE, ¿cómo se clasifican las acciones según su naturaleza?",
    "respuesta": "En directas o indirectas",
    "fuente": "CTE DB SE, apdo. 3.3.2.1, pág. 12. DB SE del CTE (RD 314/2006, modificado por última vez por RD 732/2019); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 732/2019 (BOE 27/12/2019); PDF de 27/12/2019): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE.pdf#page=12",
    "localizacion": "CTE DB SE, apdo. 3.3.2.1, pág. 12",
    "apartado": "Clasificación de las acciones"
  },
  {
    "id": "CPEI-T27-OF-57131741",
    "orden": 120,
    "concepto": "Según el CTE DB SE, ¿cómo se clasifican las acciones según la respuesta estructural?",
    "respuesta": "En estáticas o dinámicas",
    "fuente": "CTE DB SE, apdo. 3.3.2.1, pág. 12. DB SE del CTE (RD 314/2006, modificado por última vez por RD 732/2019); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 732/2019 (BOE 27/12/2019); PDF de 27/12/2019): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE.pdf#page=12",
    "localizacion": "CTE DB SE, apdo. 3.3.2.1, pág. 12",
    "apartado": "Clasificación de las acciones"
  },
  {
    "id": "CPEI-T27-OF-A7CD562C",
    "orden": 130,
    "concepto": "Según el CTE DB SE, ¿qué periodo de retorno corresponde a los valores característicos de las acciones climáticas?",
    "respuesta": "Un periodo de retorno de 50 años",
    "fuente": "CTE DB SE, apdo. 3.3.2.2, pág. 13. DB SE del CTE (RD 314/2006, modificado por última vez por RD 732/2019); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 732/2019 (BOE 27/12/2019); PDF de 27/12/2019): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE.pdf#page=13",
    "localizacion": "CTE DB SE, apdo. 3.3.2.2, pág. 13",
    "apartado": "Clasificación de las acciones"
  },
  {
    "id": "CPEI-T27-OF-535059E3",
    "orden": 140,
    "concepto": "Según el CTE DB SE, ¿durante qué porcentaje del tiempo de referencia se supera el valor frecuente de una acción variable?",
    "respuesta": "El 1%",
    "fuente": "CTE DB SE, apdo. 3.3.2.3, pág. 13. DB SE del CTE (RD 314/2006, modificado por última vez por RD 732/2019); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 732/2019 (BOE 27/12/2019); PDF de 27/12/2019): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE.pdf#page=13",
    "localizacion": "CTE DB SE, apdo. 3.3.2.3, pág. 13",
    "apartado": "Clasificación de las acciones"
  },
  {
    "id": "CPEI-T27-OF-2BED10C3",
    "orden": 150,
    "concepto": "Según el CTE DB SE, ¿durante qué porcentaje del tiempo de referencia se supera el valor casi permanente de una acción variable?",
    "respuesta": "El 50%",
    "fuente": "CTE DB SE, apdo. 3.3.2.3, pág. 13. DB SE del CTE (RD 314/2006, modificado por última vez por RD 732/2019); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta RD 732/2019 (BOE 27/12/2019); PDF de 27/12/2019): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE.pdf#page=13",
    "localizacion": "CTE DB SE, apdo. 3.3.2.3, pág. 13",
    "apartado": "Clasificación de las acciones"
  },
  {
    "id": "CPEI-T27-OF-72291A1D",
    "orden": 160,
    "concepto": "Según el CTE DB SE-AE, en viviendas, ¿qué carga basta considerar como peso propio de la tabiquería?",
    "respuesta": "Una carga de 1,0 kN por cada m2 de superficie construida",
    "fuente": "CTE DB SE-AE, apdo. 2.1, pág. 7. DB SE-AE del CTE (RD 314/2006, modificado por última vez por Orden VIV/984/2009); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta Orden VIV/984/2009 (BOE 23/04/2009); PDF de 23/04/2009): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE-AE.pdf#page=7",
    "localizacion": "CTE DB SE-AE, apdo. 2.1, pág. 7",
    "apartado": "Cargas en la edificación"
  },
  {
    "id": "CPEI-T27-OF-041DAA99",
    "orden": 170,
    "concepto": "Según el CTE DB SE-AE, ¿hasta qué peso por metro cuadrado se asimilan los tabiques ordinarios a una carga uniformemente distribuida?",
    "respuesta": "No sea superior a 1,2 kN/m2",
    "fuente": "CTE DB SE-AE, apdo. 2.1, pág. 7. DB SE-AE del CTE (RD 314/2006, modificado por última vez por Orden VIV/984/2009); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta Orden VIV/984/2009 (BOE 23/04/2009); PDF de 23/04/2009): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE-AE.pdf#page=7",
    "localizacion": "CTE DB SE-AE, apdo. 2.1, pág. 7",
    "apartado": "Cargas en la edificación"
  },
  {
    "id": "CPEI-T27-OF-AB59FA20",
    "orden": 180,
    "concepto": "Según el CTE DB SE-AE, ¿qué es la sobrecarga de uso?",
    "respuesta": "El peso de todo lo que puede gravitar sobre el edificio por razón de su uso",
    "fuente": "CTE DB SE-AE, apdo. 3.1, pág. 9. DB SE-AE del CTE (RD 314/2006, modificado por última vez por Orden VIV/984/2009); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta Orden VIV/984/2009 (BOE 23/04/2009); PDF de 23/04/2009): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE-AE.pdf#page=9",
    "localizacion": "CTE DB SE-AE, apdo. 3.1, pág. 9",
    "apartado": "Cargas en la edificación"
  },
  {
    "id": "CPEI-T27-OF-E2F10F50",
    "orden": 190,
    "concepto": "Según el CTE DB SE-AE, ¿qué se entiende por cubierta ligera?",
    "respuesta": "Aquella cuya carga permanente debida únicamente a su cerramiento no excede de 1 kN/m",
    "fuente": "CTE DB SE-AE, tabla 3.1, nota 5, pág. 10. DB SE-AE del CTE (RD 314/2006, modificado por última vez por Orden VIV/984/2009); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta Orden VIV/984/2009 (BOE 23/04/2009); PDF de 23/04/2009): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE-AE.pdf#page=10",
    "localizacion": "CTE DB SE-AE, tabla 3.1, nota 5, pág. 10",
    "apartado": "Cargas en la edificación"
  },
  {
    "id": "CPEI-T27-OF-DE9011D7",
    "orden": 200,
    "concepto": "Según el CTE DB SE-AE, ¿a qué altura se considera aplicada la fuerza horizontal sobre barandillas?",
    "respuesta": "A 1,2 m o sobre el borde superior del elemento",
    "fuente": "CTE DB SE-AE, apdo. 3.2, pág. 11. DB SE-AE del CTE (RD 314/2006, modificado por última vez por Orden VIV/984/2009); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta Orden VIV/984/2009 (BOE 23/04/2009); PDF de 23/04/2009): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE-AE.pdf#page=11",
    "localizacion": "CTE DB SE-AE, apdo. 3.2, pág. 11",
    "apartado": "Cargas en la edificación"
  },
  {
    "id": "CPEI-T27-OF-E825116B",
    "orden": 210,
    "concepto": "Según el CTE DB SE-AE, ¿qué fuerza horizontal mínima deben resistir los petos o barandillas en zonas de tráfico y aparcamiento?",
    "respuesta": "No siendo inferior a qk = 50 kN",
    "fuente": "CTE DB SE-AE, apdo. 3.2, pág. 11. DB SE-AE del CTE (RD 314/2006, modificado por última vez por Orden VIV/984/2009); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta Orden VIV/984/2009 (BOE 23/04/2009); PDF de 23/04/2009): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE-AE.pdf#page=11",
    "localizacion": "CTE DB SE-AE, apdo. 3.2, pág. 11",
    "apartado": "Cargas en la edificación"
  },
  {
    "id": "CPEI-T27-OF-B07DFBC5",
    "orden": 220,
    "concepto": "Según el CTE DB SE-AE, ¿qué fuerza horizontal deben soportar los tabiques respecto a la de la tabla 3.3?",
    "respuesta": "Una fuerza horizontal mitad a la definida en la tabla 3.3",
    "fuente": "CTE DB SE-AE, apdo. 3.2, pág. 11. DB SE-AE del CTE (RD 314/2006, modificado por última vez por Orden VIV/984/2009); texto íntegro oficial (texto consolidado del Ministerio con modificaciones hasta Orden VIV/984/2009 (BOE 23/04/2009); PDF de 23/04/2009): https://www.codigotecnico.org/pdf/Documentos/SE/DBSE-AE.pdf#page=11",
    "localizacion": "CTE DB SE-AE, apdo. 3.2, pág. 11",
    "apartado": "Cargas en la edificación"
  }
];
